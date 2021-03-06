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
        MAIL_DT_FORMAT = 'MM/DD/YYYY HH:mm:ss',
        PRICE_TABLE = {
            '31.08.15': {Full: '90', Beginner: '70', Party: '55', Friday: '20', Saturday: '25', Sunday: '15', Workshop: '15'},
            '31.10.15': {Full: '90', Beginner: '70', Party: '55', Friday: '20', Saturday: '25', Sunday: '15', Workshop: '15'},
            '30.11.15': {Full: '90', Beginner: '70', Party: '55', Friday: '20', Saturday: '25', Sunday: '15', Workshop: '15'},
            '31.01.16': {Full: '90', Beginner: '70', Party: '55', Friday: '20', Saturday: '25', Sunday: '15', Workshop: '15'},
            '29.02.16': {Full: '100', Beginner: '70', Party: '55', Friday: '20', Saturday: '25', Sunday: '15', Workshop: '15'},
            '31.03.16': {Full: '110', Beginner: '70', Party: '55', Friday: '20', Saturday: '25', Sunday: '15', Workshop: '15'},
            '01.05.16': {Full: '120', Beginner: '80', Party: '55', Friday: '20', Saturday: '25', Sunday: '15', Workshop: '15'},
            '08.05.16': {Full: '130', Beginner: '90', Party: '60', Friday: '20', Saturday: '25', Sunday: '15', Workshop: '15'}
        },
        PROMOS = {
            'RAIMO': {Full: 10, Beginner: 5},
            'NEMANJA': {Full: 10, Beginner: 5},
            'DOMINO': {Full: 10, Beginner: 5},
            'RONIE': {Full: 10, Beginner: 5},
            'RUSLAN': {Full: 10, Beginner: 5},
            'ANDREJ': {Full: 10, Beginner: 5},
            'INGA': {Full: 10, Beginner: 5},
            'VISHAL': {Full: 10, Beginner: 5},
            'OLLO': {Full: 10, Beginner: 5},
            'OMAR': {Full: 10, Beginner: 5},
            'PREKRASN': {Full: 10, Beginner: 5}
        },
        CURRENCY = 'EUR',
        validateFields = function () {
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
                return false;
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
                parseTimeStamp = function (timestamp) {
                    try {
                        var parsedTimestamp = moment(timestamp, MAIL_DT_FORMAT);
                        return parsedTimestamp.isValid() ? parsedTimestamp : moment();
                    } catch (err) {
                        return moment();
                    }

                },
                currentTime = $.QueryString.ts ? parseTimeStamp($.QueryString.ts) : moment(),
                nameField = $form.find('#registration-name'),
                surnameField = $form.find('#registration-surname'),
                promocodeField = $form.find('#registration-promocode'),
                emailField = $form.find('#registration-email'),
                passTypeField = $form.find('select[id="registration-pass"]'),
                updatePayPalButton = function () {
                    var priceFilter = function(priceDateLimitPrices, dateTime) {
                            var timeLimit = moment(dateTime, MOMENT_FORMAT);
                            return currentTime.isBefore(timeLimit, 'day') || currentTime.isSame(timeLimit, 'day');
                        },
                        findDiscount = function(promo, passType) {
                            var promoCode = promo ? promo.toUpperCase() : '';
                            return (PROMOS[promoCode] && PROMOS[promoCode][passType]) || 0;
                        },
                        passType = passTypeField.find('option:selected').val(),
                        priceForToday = _.find(PRICE_TABLE, priceFilter),
                        passPrice = priceForToday ? parseFloat(priceForToday[passType]) : 0,
                        passDiscount = findDiscount(promocodeField.val(), passType),
                        finalPassPrice = passPrice - passDiscount,
                        name = nameField.val(),
                        surname = surnameField.val(),
                        payPalConfig = {
                            "button": 'buynow',
                            "type": 'form'
                        },
                        buttonData = {
                            "return": 'http://bachatakizomba.com',
                            "cancel_return": 'http://bachatakizomba.com',
                            "cbt": 'Back to bachatakizomba.com',
                            "image_url": 'http://bachatakizomba.com/images/home-top-banner.jpg',
                            "currency_code": CURRENCY,
                            "name": 'On The Wave - ' + passType + ' Pass; ' + name + ', ' + surname + ', ' + emailField.val(),
                            "tax": '4',
                            "amount": finalPassPrice.toFixed(2),
                            "email": emailField.val(),
                            "custom": name + ', ' + surname + ', ' + emailField.val(),
                            "first_name": name,
                            "last_name": surname,
                            "no_shipping": '1'
                        };
                    if (passDiscount != 0) {
                        buttonData.custom += '; promocode: ' + promocodeField.val();
                        buttonData.name += '; promocode: ' + promocodeField.val();
                    }
                    if (!finalPassPrice) {
                        return;
                    }

                    if (IS_SANDBOX) {
                        payPalConfig.host = 'www.sandbox.paypal.com'
                    }

                    purchaseButtonContainer.html('');
                    paypal.button.create(MERCHANT_ID, buttonData, payPalConfig, purchaseButtonContainer[0]);
                };

            reInitPayPalButtonEventStream.onValue(updatePayPalButton);
            nameField.val($.QueryString.name);
            surnameField.val($.QueryString.surname);
            promocodeField.val($.QueryString.promo);
            emailField.val($.QueryString.email);
            if ($.QueryString.pass) {
                passTypeField.val($.QueryString.pass);
            }

            updatePayPalButton();
        }
    };
})(jQuery);