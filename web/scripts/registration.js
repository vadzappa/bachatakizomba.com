/**
 * User: vadzappa
 * Date: 04.02.13
 */

window.com = window.com || {};
com = window.com;

jQuery(document).ready(function () {
    com.bachatakizomba.registration.assignValidationFunction();
});

com.bachatakizomba = com.bachatakizomba || {};
com.bachatakizomba.registration = {
    CONSTANTS: {
        MANDATORY_INPUT_CLASS_NAME: "mandatory",
        INVALIDATED_INPUT_CLASS_NAME: "invalid"
    },
    assignValidationFunction: function () {
        jQuery("form").bind("submit", function () {
            var isCorrectSubmitData = true;
            jQuery("label." + com.bachatakizomba.registration.CONSTANTS.MANDATORY_INPUT_CLASS_NAME).each(function () {
                if (!isCorrectSubmitData) {
                    return;
                }
                var labelTag = jQuery(this);
                var idLabelIsFor = labelTag.attr("for");
                if (idLabelIsFor == null || idLabelIsFor.length < 1) {
                    return;
                }
                var formFieldTag = jQuery("[id=" + idLabelIsFor + "]");
                var formFieldValue = jQuery.trim(formFieldTag.val());
                if (formFieldValue.length < 3) {
                    if (isCorrectSubmitData) {
                        formFieldTag.focus();
                    }
                    isCorrectSubmitData = false;
                    labelTag.blinkElement(3);
                }
            });
            return isCorrectSubmitData;
        });
    }
};