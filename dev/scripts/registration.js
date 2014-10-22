/**
 * User: vadzappa
 * Date: 04.02.13
 */

window.com = window.com || {};
com = window.com;

(function () {

    var MERCHANT_ID = 'irinajoan@gmail.com',
        IS_SANDBOX = false,
        MOMENT_FORMAT = 'DD.MM.YY',
        PRICE_TABLE = {
            '30.09.14': {Full: '60', Saturday: '80', Sunday: '70', Party: '55'},
            '31.10.14': {Full: '70', Saturday: '80', Sunday: '70', Party: '55'},
            '30.11.14': {Full: '80', Saturday: '80', Sunday: '70', Party: '55'},
            '31.01.15': {Full: '90', Saturday: '80', Sunday: '70', Party: '55'},
            '28.02.15': {Full: '100', Saturday: '80', Sunday: '70', Party: '55'},
            '31.03.15': {Full: '110', Saturday: '80', Sunday: '70', Party: '55'},
            '03.05.15': {Full: '120', Saturday: '80', Sunday: '70', Party: '55'},
            '08.05.15': {Full: '130', Saturday: '85', Sunday: '75', Party: '60'}
        },
        CURRENCY = 'EUR',
        validateFields = function (focusAndBlink) {
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
                        if (focusAndBlink) {
                            formFieldTag.focus();
                        }
                    }
                    isCorrectSubmitData = false;
                    if (focusAndBlink) {
                        labelTag.blinkElement(3);
                    }
                }
            });
            return isCorrectSubmitData;
        };

    $(document).ready(function () {
        com.bachatakizomba.registration.assignValidationFunction();
        com.bachatakizomba.registration.initPayPalButton();
    });

    com.bachatakizomba = com.bachatakizomba || {};
    com.bachatakizomba.registration = {
        CONSTANTS: {
            MANDATORY_INPUT_CLASS_NAME: "mandatory",
            INVALIDATED_INPUT_CLASS_NAME: "invalid"
        },
        assignValidationFunction: function () {
            $("form").bind("submit", function () {
                return validateFields(true);
            });
        },
        initPayPalButton: function () {
            var $form = $('form'),
                selectsUpdated = $form.asEventStream('change', 'select'),
                textDataUpdated = $form.asEventStream('keyup blur', 'input[type="text"]'),
                formSubmit = $form.asEventStream('submit'),
                dataFilter = $.proxy(validateFields, null, false),
            //dataFilter = true,
                reInitPayPalButtonEventStream = selectsUpdated.merge(textDataUpdated).merge(formSubmit).filter(dataFilter).debounce(300),
                purchaseButtonContainer = $('[id="paypal-purchase"]'),
                currentTime = moment(),
                updatePayPalButton = function () {
                    var priceFilter = function (priceDateLimitPrices, dateTime) {
                            var timeLimit = moment(dateTime, MOMENT_FORMAT);
                            return currentTime.isBefore(timeLimit);
                        },
                        passType = $form.find('select[id="entry_1818835772"] option:selected').val(),
                        priceForToday = _.find(PRICE_TABLE, priceFilter),
                        passPrice = priceForToday ? priceForToday[passType] : null,
                        name = $form.find('#entry_1987303274').val(),
                        surname = $form.find('#entry_50388262').val(),
                        payPalConfig = {
                            "button": 'buynow',
                            "type": 'form'
                        },
                        buttonData = {
                            "return": 'http://bachatakizomba.com',
                            "cancel_return": 'http://bachatakizomba.com/registration.html',
                            "cbt": 'Back to bachatakizomba.com',
                            "image_url": 'http://bachatakizomba.com/images/home-top-banner.png',
                            "currency_code": CURRENCY,
                            "name": 'On The Wave - ' + passType + ' Pass',
                            "amount": passPrice,
                            "address1": $form.find('#entry_1729249845').val(),
                            "country": $form.find('#entry_1184411726').val(),
                            "email": $form.find('#entry_244204092').val(),
                            "first_name": name,
                            "last_name": surname,
                            "no_shipping": '1'
                        };
                    if (!passPrice) {
                        return;
                    }

                    if (IS_SANDBOX) {
                        payPalConfig.host = 'www.sandbox.paypal.com'
                    }

                    purchaseButtonContainer.html('');
                    paypal.button.create(MERCHANT_ID, buttonData, payPalConfig, purchaseButtonContainer[0]);
                };

            reInitPayPalButtonEventStream.onValue(updatePayPalButton);

        }
    };
})(jQuery);