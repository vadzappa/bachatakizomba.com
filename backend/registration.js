/**
 * Created by zapolski on 11.11.2014.
 */
var _ = require('lodash'),
    request = require('request'),
    fs = require('fs'),
    registrationUrl = 'https://docs.google.com/forms/d/1EV7UxcMJgTGxdiX7wl5zLiIfo4EnuqCibq0fynobKMI/formResponse?embedded=true',
    registrationTemplate = fs.readFileSync('./web/registration.html'),
    cheerio = require('cheerio'),
    NOT_EMPTY_REGEXP = /(.*\S){3}/i,
    EMAIL_REGEXP = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/,
    FORM_FIELDS_VALIDATIONS = {
        'entry.1987303274': NOT_EMPTY_REGEXP,
        'entry.50388262': NOT_EMPTY_REGEXP,
        'entry.244204092': EMAIL_REGEXP,
        'entry.2042503042': NOT_EMPTY_REGEXP,
        'entry.1818835772': NOT_EMPTY_REGEXP
    },
    google_re_captcha_PK = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? process.env.G_API_PK_PROD : process.env.G_API_PK;

var hasInvalidFormField = function (parameters) {
        return _.find(parameters, function (value, name) {
            if (!FORM_FIELDS_VALIDATIONS[name]) {
                return false;
            }
            return !FORM_FIELDS_VALIDATIONS[name].test(value);
        });
    },
    resendFormForResubmission = function (req, resp) {
        resp.set('Content-Type', 'text/html');
        var $ = cheerio.load(registrationTemplate);
        _.each(req.body, function (value, name) {
            $('[name="' + name + '"]').val(value);
        });
        resp.send($.html());
    };

module.exports = function (req, resp) {
    if (!req.body) {
        return resp.redirect('/registration.html');

    }
    if (hasInvalidFormField(req.body)) {
        return resendFormForResubmission(req, resp);
    }
    request.post({
        url: 'https://www.google.com/recaptcha/api/verify',
        form: {
            privatekey: google_re_captcha_PK,
            remoteip: req.ip,
            challenge: req.body.recaptcha_challenge_field,
            response: req.body.recaptcha_response_field
        }
    }, function (err, httpResponse, body) {
        var responseDetails = body.split('\n');
        if (responseDetails[0] === 'true') {
            request.post({url: registrationUrl, form: req.body});
            resp.redirect('/registration_ok.html');
        } else {
            console.log(responseDetails);
            resendFormForResubmission(req, resp);
        }
    });

};