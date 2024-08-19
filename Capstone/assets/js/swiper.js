var swiper = new Swiper('.blog-slider', {
    spaceBetween: 30,
    effect: 'fade',
    loop: true,
    mouseWheel: {
        invert: false,
    },
    // autoHeight: true
    autoplay: {
        delay: 5000, // Adjust the delay between slides (in milliseconds)
        disableOnInteraction: false, // Keeps autoplay running after user interactions
    },
    pagination: {
        el: '.blog-slider__pagination',
        clickable: true,
    }
});

