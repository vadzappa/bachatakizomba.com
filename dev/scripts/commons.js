/**
 * User: vadzappa
 * Date: 20.01.13
 */


(function ($, window) {
    window.com = window.com || {};

    $(document).ready(function () {
        com.bachatakizomba.applyDesiredLanguage();
        com.bachatakizomba.setupLanguageSwitchingLinks();
    });

    window.com.bachatakizomba = window.com.bachatakizomba || {
        CONSTANTS: {
            LANG_SWITCH_LINK_CLASS: "lang-switch",
            HOME_LANG_SWITCH_LINK_CLASS: "hom-lang-switch",
            LOCALIZATION_FOLDER: "localization/",
            LOCALIZATION_FILE_EXT: ".json",
            AVAILABLE_LANGUAGES: ["eng", "lat", "rus"],
            LANGUAGE_REQUEST_PARAMETER: "lang",
            DEFAULT_PAGE: "index"
        },
        applyDesiredLanguage: function () {
            var requestedParameters = window.location.search;
            if (requestedParameters.length < 1) {
                return;
            }
            var requestedParametersArray = requestedParameters.substr(1).split("&");
            for (var i = 0; i < requestedParametersArray.length; i++) {
                var parameterAndValue = requestedParametersArray[i].split("=");
                if (parameterAndValue[0] == com.bachatakizomba.CONSTANTS.LANGUAGE_REQUEST_PARAMETER) {
                    com.bachatakizomba.switchLanguage({languageName: parameterAndValue[1]});
                }
            }
        },
        setupLanguageSwitchingLinks: function () {
            $("a." + com.bachatakizomba.CONSTANTS.LANG_SWITCH_LINK_CLASS).bind("click", function (e) {
                com.bachatakizomba.switchLanguage({hrefNode: e.target});
            });
            $("a." + com.bachatakizomba.CONSTANTS.HOME_LANG_SWITCH_LINK_CLASS).bind("click", function (e) {
                var selectedLanguage = $(this).find('img').attr('lang');
                com.bachatakizomba.switchLanguage({languageName: selectedLanguage}, {updateAvailableLanguages: false});
            });
        },
        /**
         *
         * @param desiredLanguageDetails - {hrefNode:,languageName:} - any of 2 should be specified. if both - languageName has priority!
         * @param options - perform different actions or not
         */
        switchLanguage: function (desiredLanguageDetails, options) {
            if (typeof  options === 'undefined') {
                options = {updateAvailableLanguages: true}
            }
            var detectRequestedLanguage = function () {
                if (typeof desiredLanguageDetails["languageName"] == "string") {
                    return desiredLanguageDetails["languageName"].toLowerCase();
                }
                if (typeof desiredLanguageDetails["hrefNode"] == "object") {
                    return $(desiredLanguageDetails["hrefNode"]).text().toLowerCase();
                }
                return undefined;
            };
            var buildRequestedLanguageUrlSuffix = function () {
                var requestedLanguage = detectRequestedLanguage();
                return "?" + com.bachatakizomba.CONSTANTS.LANGUAGE_REQUEST_PARAMETER + "=" + requestedLanguage;
            };
            var detectCurrentClientPageName = function () {
                var currentClientPageName = window.location.pathname;
                var lastSlashPosition = currentClientPageName.lastIndexOf("/");
                if (lastSlashPosition > -1) {
                    currentClientPageName = currentClientPageName.substr(lastSlashPosition + 1);
                    var lastDotPosition = currentClientPageName.lastIndexOf(".");
                    if (lastDotPosition > -1) {
                        currentClientPageName = currentClientPageName.substring(0, lastDotPosition);
                    }
                }
                if (currentClientPageName.length < 1) {
                    currentClientPageName = com.bachatakizomba.CONSTANTS.DEFAULT_PAGE;
                }
                return currentClientPageName;
            };
            var buildCacheCleanerSufix = function () {
                return "?datefix=" + (new Date()).getTime();
            };
            var buildTranslationsResourceUrl = function () {
                var languageRequested = detectRequestedLanguage();
                var clientPageName = detectCurrentClientPageName();
                var cacheCleanerSuffix = buildCacheCleanerSufix();
                return com.bachatakizomba.CONSTANTS.LOCALIZATION_FOLDER + languageRequested + "/" + clientPageName + com.bachatakizomba.CONSTANTS.LOCALIZATION_FILE_EXT + cacheCleanerSuffix;
            };

            var findPartBeforeLastSlash = function (fullStringWithSlashes) {
                var lastSlashIndex = fullStringWithSlashes.lastIndexOf("/");
                if (lastSlashIndex > 0) {
                    return fullStringWithSlashes.substring(0, lastSlashIndex);
                }
                return fullStringWithSlashes;
            };

            var applyLocalizationFromUrl = function (localizationFilePath) {
                $.getJSON(localizationFilePath, function (data) {
                    var prefixPart = findPartBeforeLastSlash(localizationFilePath);
                    for (var i = 0; i < data.length; i++) {
                        for (var elementId in data[i]) {
                            if (elementId == "-include-ext") {
                                var allExternalFilesLinks = data[i][elementId];
                                for (var j = 0; j < allExternalFilesLinks.length; j++) {
                                    applyLocalizationFromUrl(prefixPart + allExternalFilesLinks[j] + buildCacheCleanerSufix());
                                }
                                continue;
                            }
                            var localizedElement = $("[id=" + elementId + "]");
                            if (localizedElement.filter("input[type='button'],input[type='submit']").length > 0) {
                                localizedElement.val(data[i][elementId]);
                            } else {
                                localizedElement.html(data[i][elementId]);
                            }
                        }
                    }
                });
            };

            var retrieveAndApplyLocalizations = function () {
                var localizationFilePath = buildTranslationsResourceUrl();
                applyLocalizationFromUrl(localizationFilePath);
            };
            var updateAvailableLanguages = function () {
                var requestedLanguage = detectRequestedLanguage();
                var languageElementsContainer = $("a." + com.bachatakizomba.CONSTANTS.LANG_SWITCH_LINK_CLASS).closest("div");
                // cleaning container
                languageElementsContainer.html("");
                for (var i = 0; i < com.bachatakizomba.CONSTANTS.AVAILABLE_LANGUAGES.length; i++) {
                    if (com.bachatakizomba.CONSTANTS.AVAILABLE_LANGUAGES[i] == requestedLanguage) {
                        continue;
                    }
                    var languageSwitchLink = $("<a/>");
                    languageSwitchLink.attr("href", "javascript:void(0);");
                    languageSwitchLink.addClass(com.bachatakizomba.CONSTANTS.LANG_SWITCH_LINK_CLASS);
                    languageSwitchLink.text(com.bachatakizomba.CONSTANTS.AVAILABLE_LANGUAGES[i].toUpperCase());
                    languageElementsContainer.append(languageSwitchLink);
                    if ($("a." + com.bachatakizomba.CONSTANTS.LANG_SWITCH_LINK_CLASS).length > 0) {
                        languageElementsContainer.append("&nbsp;&nbsp;");
                    }
                }
                com.bachatakizomba.setupLanguageSwitchingLinks();
            };
            var setLanguagesSuffixesForLinks = function () {
                var requestedLanguageUrlSuffix = buildRequestedLanguageUrlSuffix();
                $("a").each(function (index, element) {
                    if ($(this).attr("href").indexOf("javascript:") >= 0) {
                        return;
                    }
                    var updatedDesiredHrefAttribute = $(this).attr("href");
                    if (updatedDesiredHrefAttribute.indexOf("?") < 0) {
                        updatedDesiredHrefAttribute += requestedLanguageUrlSuffix;
                    } else {
                        updatedDesiredHrefAttribute = updatedDesiredHrefAttribute.substring(0, updatedDesiredHrefAttribute.indexOf("?")) + requestedLanguageUrlSuffix;
                    }
                    $(this).attr("href", updatedDesiredHrefAttribute);
                });
            };
            retrieveAndApplyLocalizations();
            if (options.updateAvailableLanguages) {
                updateAvailableLanguages();
            }
            setLanguagesSuffixesForLinks();
        }
    };

})(jQuery, window);

(function ($) {
    $.fn.blinkElement = function (qtyOfTimes) {
        var COMMON_SPEED = 200;

        var callBackFunction = function (jQueryElement) {

        };
        if (qtyOfTimes > 1) {
            callBackFunction = function (jQueryElement) {
                jQueryElement.blinkElement(qtyOfTimes - 1);
            };
        }
        this.animate({
            opacity: 0.1
        }, COMMON_SPEED, "swing", function () {
            $(this).animate({opacity: 1}, COMMON_SPEED, "swing", function () {
                callBackFunction($(this));
            });
        });
    };
    $.QueryString = (function(a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));
})(jQuery);