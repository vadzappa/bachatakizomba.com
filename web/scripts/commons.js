/**
 * User: vadzappa
 * Date: 20.01.13
 */

window.com = window.com || {};
com = window.com;

jQuery(document).ready(function () {
    com.bachatakizomba.applyDesiredLanguage();
    com.bachatakizomba.setupLangaugeSwitchingLinks();
});

com.bachatakizomba = com.bachatakizomba || {
    CONSTANTS: {
        LANG_SWITCH_LINK_CLASS: "lang-switch",
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
    setupLangaugeSwitchingLinks: function () {
        jQuery("a." + com.bachatakizomba.CONSTANTS.LANG_SWITCH_LINK_CLASS).bind("click", function (e) {
            com.bachatakizomba.switchLanguage({hrefNode: e.target});
        });
    },
    /**
     *
     * @param desiredLanguageDetails {hrefNode:,languageName:} - any of 2 should be specified. if both - languageName has priority!
     */
    switchLanguage: function (desiredLanguageDetails) {
        var detectRequestedLanguage = function () {
            if (typeof desiredLanguageDetails["languageName"] == "string") {
                return desiredLanguageDetails["languageName"].toLowerCase();
            }
            if (typeof desiredLanguageDetails["hrefNode"] == "object") {
                return jQuery(desiredLanguageDetails["hrefNode"]).text().toLowerCase();
            }
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
            jQuery.getJSON(localizationFilePath, function (data) {
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
                        var localizedElement = jQuery("[id=" + elementId + "]");
                        if (localizedElement.filter("input[type='button'],input[type='submit']").length > 0){
                            localizedElement.val(data[i][elementId]);
                        } else {
                            localizedElement.html(data[i][elementId]);
                        }
                    }
                }
            });
        };

        var retreiveAndApplyLocalizations = function () {
            var localizationFilePath = buildTranslationsResourceUrl();
            applyLocalizationFromUrl(localizationFilePath);
        }
        var updateAvailableLanguages = function () {
            var requestedLanguage = detectRequestedLanguage();
            var languageElementsContainer = jQuery("a." + com.bachatakizomba.CONSTANTS.LANG_SWITCH_LINK_CLASS).closest("div");
            // cleaning container
            languageElementsContainer.html("");
            for (var i = 0; i < com.bachatakizomba.CONSTANTS.AVAILABLE_LANGUAGES.length; i++) {
                if (com.bachatakizomba.CONSTANTS.AVAILABLE_LANGUAGES[i] == requestedLanguage) {
                    continue;
                }
                var languageSwitchLink = jQuery("<a/>");
                languageSwitchLink.attr("href", "javascript:void(0);");
                languageSwitchLink.addClass(com.bachatakizomba.CONSTANTS.LANG_SWITCH_LINK_CLASS);
                languageSwitchLink.text(com.bachatakizomba.CONSTANTS.AVAILABLE_LANGUAGES[i].toUpperCase());
                languageElementsContainer.append(languageSwitchLink);
                if (jQuery("a." + com.bachatakizomba.CONSTANTS.LANG_SWITCH_LINK_CLASS).length > 0) {
                    languageElementsContainer.append("&nbsp;&nbsp;");
                }
            }
            com.bachatakizomba.setupLangaugeSwitchingLinks();
        };
        var setLanguagesSuffixesForLinks = function () {
            var requestedLanguage = detectRequestedLanguage();
            var requestedLanguageUrlSuffix = buildRequestedLanguageUrlSuffix();
            jQuery("a").each(function (index, element) {
                if (jQuery(this).attr("href").indexOf("javascript:") >= 0) {
                    return;
                }
                var updatedDesiredHrefAttribute = jQuery(this).attr("href");
                if (updatedDesiredHrefAttribute.indexOf("?") < 0) {
                    updatedDesiredHrefAttribute += requestedLanguageUrlSuffix;
                } else {
                    updatedDesiredHrefAttribute = updatedDesiredHrefAttribute.substring(0, updatedDesiredHrefAttribute.indexOf("?")) + requestedLanguageUrlSuffix;
                }
                jQuery(this).attr("href", updatedDesiredHrefAttribute);
            });
        };
        retreiveAndApplyLocalizations();
        updateAvailableLanguages();
        setLanguagesSuffixesForLinks();
    }
};

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
})(jQuery);