(function($) {

    "use strict";


    // Testimonials Carousel

    $(".testimonials-wrapper").owlCarousel({
        loop: true,
        margin: 15,
        nav: false,
        dots: true,
        autoplay: true,
        items: 1
    });

    // Gallery

   $(document).ready(function(){
        if ($("#macy-container").length > 0) {
        var macy = Macy({
            container: '#macy-container',
            trueOrder: false,
            waitForImages: false,
            margin: 10,
            columns: 4,
            breakAt: {
                1200: 4,
                992: 3,
                520: 1,
                400: 1
            }
        });

    }
});



    // Section Scroll - Navbar


    $('.navbar-nav a').on('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 50
        }, 1500, 'easeInOutExpo');

        if ($('.navbar').hasClass('active')) {
            $('.navbar').removeClass('active')
            $('.ham').removeClass('active')
        }

        var collapsed_menu = $(".navbar-collapse").hasClass("show");

        if(collapsed_menu){
            $(".navbar-collapse").removeClass("show");
        }

        event.preventDefault();
    });


    // Fixed menu
    function fixed_menu() {
        var win = $(window);
        win.on("scroll", function() {
            var header_top_height = $(".header-top").height();
            var window_height = win.scrollTop();
            if (window_height > (header_top_height + 200)) {
                $(".header-area").addClass("fixed-top");
            } else {
                $(".header-area").removeClass("fixed-top");
            }

        });
    }

    fixed_menu();

    $(".hero-slider").owlCarousel({
        loop: true,
        margin: 0,
        nav: false,
        dots: true,
        autoplay: true,
        items: 1

    });

    function scrolltop() {
        var wind = $(window);
        wind.on("scroll", function() {
            var scrollTop = wind.scrollTop();
            if (scrollTop >= 500) {
                $(".scroll-top").fadeIn("slow");
            } else {
                $(".scroll-top").fadeOut("slow");
            }

        });

        $(".scroll-top").on("click", function() {
            var bodyTop = $("html, body");
            bodyTop.animate({
                scrollTop: 0
            }, 800, "easeOutCubic");
        });

    }

    scrolltop();

    AOS.init({
        once: true
    });



})(jQuery);