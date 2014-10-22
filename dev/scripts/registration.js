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
        CONSTANTS: {
            MANDATORY_INPUT_CLASS_NAME: "mandatory",
            INVALIDATED_INPUT_CLASS_NAME: "invalid"
        },
        assignValidationFunction: function () {
            $("form").bind("submit", function () {
                return validateFields();
            });
        }
    };
})(jQuery);