/**
 * User: vadzappa
 * Date: 04.02.13
 */

window.com = window.com || {};
com = window.com;

(function () {

    var validateFields = function () {
            var isCorrectSubmitData = true;
            $("label." + com.bachatakizomba.registration.CONSTANTS.MANDATORY_INPUT_CLASS_NAME).each(function () {
                if (!isCorrectSubmitData) {
                    return;
                }
                var labelTag = $(this);
                var idLabelIsFor = labelTag.attr("for");
                if (idLabelIsFor == null || idLabelIsFor.length < 1) {
                    return;
                }
                var formFieldTag = $("[id=" + idLabelIsFor + "]");
                var formFieldValue = $.trim(formFieldTag.val());
                if (formFieldValue.length < 3) {
                    if (isCorrectSubmitData) {
                        formFieldTag.focus();
                    }
                    isCorrectSubmitData = false;
                    labelTag.blinkElement(3);
                }
            });
            return isCorrectSubmitData;
        };

    $(document).ready(function () {
        com.bachatakizomba.registration.assignValidationFunction();
    });

    com.bachatakizomba = com.bachatakizomba || {};
    com.bachatakizomba.registration = {
        MAIL_DT_FORMAT: 'MM/DD/YYYY HH:mm:ss',
        FIELDS_MAP: {
            'entry.1987303274': 'name',
            'entry.50388262': 'surname',
            'entry.244204092': 'email',
            'entry.1818835772': 'pass',
            'entry.1154208259': 'promo'
        },
        CONSTANTS: {
            MANDATORY_INPUT_CLASS_NAME: "mandatory",
            INVALIDATED_INPUT_CLASS_NAME: "invalid"
        },
        redirectAfterComplete: function(formData) {
            return function() {
                var qs = {},
                    redirectUrl = '/payment.html';
                $.each(com.bachatakizomba.registration.FIELDS_MAP, function(key, value) {
                    qs[value] = formData[key];
                });
                qs.ts = moment().format(com.bachatakizomba.registration.MAIL_DT_FORMAT);
                window.location = redirectUrl + '?' + $.param(qs);
            };
        },
        assignValidationFunction: function () {
            $("form").bind("submit", function () {
                var form = this,
                    mapFormFields = function() {
                        var formData = {};
                        $(form).find('[name^="entry."]').each(function() {
                            formData[$(this).attr('name')] = $(this).val();
                        });
                        return formData;
                    };
                if (validateFields()) {
                    var formData = mapFormFields(),
                        onComplete = com.bachatakizomba.registration.redirectAfterComplete(formData);
                    $.ajax({
                        cache: false,
                        crossDomain: true,
                        url: 'https://docs.google.com/a/www.bachatakizomba.com/forms/d/1EV7UxcMJgTGxdiX7wl5zLiIfo4EnuqCibq0fynobKMI/formResponse',
                        type: 'POST',
                        dataType: 'xml',
                        data: formData,
                        complete: onComplete
                    });
                }
                return false;
            });
        }
    };
})(jQuery);