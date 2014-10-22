/**
 * User: vadzappa
 * Date: 08.02.13
 */

window.com = window.com || {};
com = window.com;

com.bachatakizomba = com.bachatakizomba || {};

jQuery(document).ready(function () {
    com.bachatakizomba.gallery.prepareHeadersToLoadGalleries();
});

com.bachatakizomba.gallery = {
    CONSTANTS: {
        IMAGE_DIV_CLASS: "image-details",
        WORKSHOPS_GALLERY_DETAILS: {"id": "workshops-gallery-header", "url": "/gallery/gallery-workshops.json"},
        PARTIES_GALLERY_DETAILS: {"id": "parties-gallery-header", "url": "/gallery/gallery-parties.json"},
        SHOWS_GALLERY_DETAILS: {"id": "shows-gallery-header", "url": "/gallery/gallery-shows.json"},
        GALLERY_CATEGORIES_KEEPER: "gallery-categories-keeper",
        ACTIVE_HEADER_CLICKED_CLASS: "active",
        IMAGES_PAGINATOR: "images-paginator",
        GALLERY_IMAGES_KEEPER: "gallery-images-keeper",
        CURRENT_PAGE_LINK: "current",
        THUMB_WIDTH_HEIGHT: 100,
        MAXIMUM_IMAGES_PER_PAGE: 20
    },
    prepareImageGallery: function (divWithGalleryImages) {
        var backgroundColor = "#007BC9";
        divWithGalleryImages.parent("div").yoxview({
            playDelay: 2000,
            cacheBuffer: 2,
            backgroundColor: backgroundColor,
            backgroundOpacity: 0.3,
            infoBackOpacity: 0.8,
            menuBackgroundOpacity: 0.8
        });
        var quantityOfPages = divWithGalleryImages.length;
        for (var j = 1; j <= quantityOfPages; j++) {
            (function (j) {
                var pageLink = jQuery("<a href='javascript:void(0);'>[" + j + "]</a>");
                pageLink.bind("click", function () {
                    jQuery("div." + com.bachatakizomba.gallery.CONSTANTS.GALLERY_IMAGES_KEEPER).hide().filter(":eq(" + (j - 1) + ")").show();

                    var imagePaginators = jQuery("div." + com.bachatakizomba.gallery.CONSTANTS.IMAGES_PAGINATOR);

                    imagePaginators.find("a").removeClass(com.bachatakizomba.gallery.CONSTANTS.CURRENT_PAGE_LINK);
                    imagePaginators.find("a:nth-child(" + j + ")").addClass(com.bachatakizomba.gallery.CONSTANTS.CURRENT_PAGE_LINK);
                });
                jQuery("div." + com.bachatakizomba.gallery.CONSTANTS.IMAGES_PAGINATOR).append(pageLink);
            })(j);
        }
        var imagePaginators = jQuery("div." + com.bachatakizomba.gallery.CONSTANTS.IMAGES_PAGINATOR);
        if (imagePaginators.find("a." + com.bachatakizomba.gallery.CONSTANTS.CURRENT_PAGE_LINK).length < 1) {
            imagePaginators.find("a:nth-child(" + 1 + ")").addClass(com.bachatakizomba.gallery.CONSTANTS.CURRENT_PAGE_LINK);
        }
    },
    prepareHeadersToLoadGalleries: function () {

        var galleryTypeLinkClicked = function (/**HtmlElement*/headerClicked) {
            var getGalleryUrlById = function (/**String*/elementId) {
                switch (elementId) {
                    case com.bachatakizomba.gallery.CONSTANTS.WORKSHOPS_GALLERY_DETAILS.id:
                        return com.bachatakizomba.gallery.CONSTANTS.WORKSHOPS_GALLERY_DETAILS.url;
                    case com.bachatakizomba.gallery.CONSTANTS.PARTIES_GALLERY_DETAILS.id:
                        return com.bachatakizomba.gallery.CONSTANTS.PARTIES_GALLERY_DETAILS.url;
                    case com.bachatakizomba.gallery.CONSTANTS.SHOWS_GALLERY_DETAILS.id:
                        return com.bachatakizomba.gallery.CONSTANTS.SHOWS_GALLERY_DETAILS.url;
                }
                return "";
            };

            var divToLoadGalleryTo = jQuery("div." + com.bachatakizomba.gallery.CONSTANTS.GALLERY_IMAGES_KEEPER);

            jQuery("div." + com.bachatakizomba.gallery.CONSTANTS.GALLERY_CATEGORIES_KEEPER + " h3").removeClass(com.bachatakizomba.gallery.CONSTANTS.ACTIVE_HEADER_CLICKED_CLASS);
            headerClicked.addClass(com.bachatakizomba.gallery.CONSTANTS.ACTIVE_HEADER_CLICKED_CLASS);

            var galleryUrl = getGalleryUrlById(headerClicked.attr("id"));

            com.bachatakizomba.gallery.loadGalleryToPage(divToLoadGalleryTo, galleryUrl, function () {
                divToLoadGalleryTo = jQuery("div." + com.bachatakizomba.gallery.CONSTANTS.GALLERY_IMAGES_KEEPER);
                com.bachatakizomba.gallery.prepareImageGallery(divToLoadGalleryTo);
            });
        };

        jQuery("div." + com.bachatakizomba.gallery.CONSTANTS.GALLERY_CATEGORIES_KEEPER + " h3").click(function () {
            galleryTypeLinkClicked(jQuery(this));
        });
        jQuery("div." + com.bachatakizomba.gallery.CONSTANTS.GALLERY_CATEGORIES_KEEPER + " img").click(function () {
            galleryTypeLinkClicked(jQuery(this).parent().find("h3"));
        });
    },
    loadGalleryToPage: function (/**HTML Object*/divToLoadTo, /**String*/jsonContentUrl, /**Callback*/callbackFunction) {

        var buildCacheCleanerSufix = function () {
            return "?datefix=" + (new Date()).getTime();
        };

        var cleanImagesGallery = function () {
            var elementsToBeRemoved = divToLoadTo.filter(":hidden");
            elementsToBeRemoved.remove();
            divToLoadTo = divToLoadTo.not(elementsToBeRemoved);
            divToLoadTo.find("div." + com.bachatakizomba.gallery.CONSTANTS.IMAGE_DIV_CLASS).remove();
            jQuery("div." + com.bachatakizomba.gallery.CONSTANTS.IMAGES_PAGINATOR).find("*").remove();
        };

        cleanImagesGallery();

        jQuery.getJSON(jsonContentUrl + buildCacheCleanerSufix(), function (data) {

            var prepareImageDiv = function () {
                return jQuery("<div class='" + com.bachatakizomba.gallery.CONSTANTS.IMAGE_DIV_CLASS + "'></div>");
            };

            var prepareImageThumb = function (/**String*/title, /**String*/thumbUrl, /**String*/pictUrl) {
                var preparedImage = jQuery("<img/>");
                preparedImage.attr("src", thumbUrl);
                preparedImage.attr("width", com.bachatakizomba.gallery.CONSTANTS.THUMB_WIDTH_HEIGHT);
                preparedImage.attr("height", com.bachatakizomba.gallery.CONSTANTS.THUMB_WIDTH_HEIGHT);
                preparedImage.attr("alt", title);
                preparedImage.attr("title", title);
                var fullImageSizeUrl = jQuery("<a/>");
                fullImageSizeUrl.attr("href", pictUrl);
                fullImageSizeUrl.append(preparedImage);
                return fullImageSizeUrl;
            };

            for (var i = 0; i < data.length; i++) {
                var newImageDiv = prepareImageDiv();
                var newImageThumb = prepareImageThumb(data[i].title, data[i].thumb, data[i].pict);
                newImageDiv.append(newImageThumb);
                if (i != 0 && (i % com.bachatakizomba.gallery.CONSTANTS.MAXIMUM_IMAGES_PER_PAGE) == 0) {
                    var newDivWithImages = divToLoadTo.clone();
                    newDivWithImages.hide();
                    newDivWithImages.find("div." + com.bachatakizomba.gallery.CONSTANTS.IMAGE_DIV_CLASS).remove();
                    newDivWithImages.insertAfter(divToLoadTo);
                    divToLoadTo = newDivWithImages;
                }
                divToLoadTo.append(newImageDiv);
            }

            if (typeof  callbackFunction == "function") {
                callbackFunction.call(this);
            }
        });
    }
};
