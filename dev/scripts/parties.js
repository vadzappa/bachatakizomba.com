(function ($, document, window) {
    window.com = window.com || {};

    $(document).ready(function () {
        handleImagesClicks();
        $(document.body).parent().on('click', '.magnified-image', function () {
            $(document.body).removeClass('magnified-image');
        });
        preLoadBigImages();
    });

    var handleImagesClicks = function handleImagesClicks() {
        var bigImages = $('.party-image');
        bigImages.on('click', function (e) {
            var bigImageSrc = $(this).find('img').data('big-image');
            $(document.body).find('#magnified-image img').attr('src', bigImageSrc);
            $(document.body).addClass('magnified-image');
            e.stopPropagation();
        });
    };

    var preLoadBigImages = function preLoadBigImages() {
        setTimeout(function () {
            $('[data-big-image]').each(function () {
                var bigImgUrl = $(this).data('big-image');
                new Image(bigImgUrl).src = bigImgUrl;
            })
        }, 0);
    }

})(jQuery, document, window);