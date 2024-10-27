(function ($) {
    "use strict";

    //--------------------------------------------------
    // Preloader
    //--------------------------------------------------
    $(window).on('load', function () {
        $('.preloader').fadeOut('slow');
        RevealLoad();
        startAnim();
        $('.preloader').removeClass()
    })


    //--------------------------------------------------
    // Animation Start
    //--------------------------------------------------
    function startAnim() {
        TweenMax.from('.logo', 1, {
            y: '100',
            autoAlpha: 0,
            delay: '.1',
            ease: Power4.easeInOut,
        })
        TweenMax.from('.toggle-btn', 0.5, {
            y: '100',
            delay: '.1',
            autoAlpha: 0,
            ease: Power4.easeInOut,
        })
        TweenMax.from('.bg-right', 0.5, {
            x: 100,
            ease: Power4.easeInOut,
            delay: '.1',
        })
        TweenMax.from('.bg-about', 0.5, {
            x: 100,
            ease: Power4.easeInOut,
            delay: '.1',
        })

        TweenMax.from('.scr', 0.5, {
            y: '100',
            ease: Power4.easeInOut,
            autoAlpha: 0,
        })

        TweenMax.from('.scrolls', 1, {
            y: '100',
            delay: 1,
            ease: Power4.easeInOut,
            autoAlpha: 0,
        })


        TweenMax.to('.menu', 0, {
            autoAlpha: 0,
        })


    }


    //--------------------------------------------------
    // Parralax
    //--------------------------------------------------
    var headermove = $('#headmove').get(0);
    var parallaxInstance = new Parallax(headermove, {
        relativeInput: true,
        scalarX: 14,
        hoverOnly: false,
    });


    //--------------------------------------------------
    // Web Load
    //--------------------------------------------------
    function RevealLoad() {
        var loadTL = new TimelineMax();
        var block1 = $('.block-1');
        var block2 = $('.block-2');
        var logo = $('.logo-load');

        loadTL
            .to(block1, 0.5, {
                height: '0',
                delay: '0'
            })
            .to(block2, 0.5, {
                height: '0',
            })
            .to(logo, 0, {
                autoAlpha: 0,
                delay: '-0.4',
            })

        loadTL.play();
    }

    function HideLoad() {
        var loadTL = new TimelineMax();
        var block1 = $('.block-1');
        var block2 = $('.block-2');
        var logo = $('.logo-load');

        loadTL
            .to(block1, 0.5, {
                height: '100%',
                delay: '0'
            })
            .to(block2, 0.5, {
                height: '100%',
            })
            .to(logo, 0, {
                autoAlpha: 1,
                delay: '-0.5'
            })

        loadTL.play();
    }

    $('.load-spiral').on('click', function (e) {
        e.preventDefault();
        setTimeout(function (url) {
            window.location = url
        }, 1000, this.href);
        HideLoad();
    });


    //--------------------------------------------------
    // Animation on navbar scrolling background
    //--------------------------------------------------
    var wind = $(window);

    wind.on("scroll", function () {
        var bodyScroll = wind.scrollTop();

        if (bodyScroll > 300) {

            TweenMax.to('.scr', .5, {
                autoAlpha: 0,
                y: '100',

            })

            TweenMax.to('.scrolls', .5, {
                autoAlpha: 0,
                y: '100',

            })


        } else {
            TweenMax.to('.scr', 1, {
                autoAlpha: 1,
                y: '00',

            })

            TweenMax.to('.scrolls', .5, {
                autoAlpha: 1,
                y: '0',

            })

        }
    });


    $('.img-folio').on('mouseenter', function () {
        TweenMax.to(this, 0.4, {
            y: '-20',
        })
    });

    $('.img-folio').on('mouseleave', function () {
        TweenMax.to(this, 0.4, {
            y: '1',
        })
    });


    luxy.init({
        wrapper: '#spiral',
     
    });

    //--------------------------------------------------
    // Cursor
    //--------------------------------------------------



    //--------------------------------------------------
    // Work detail slider
    //--------------------------------------------------
    workSlider();

    function workSlider() {
        var workSlide = $('.work-slider .owl-carousel');
        workSlide.owlCarousel({
            loop: true,
            margin: 30,
            mouseDrag: false,
            autoplay: false,
            center: false,
            dots: false,
            dragEndSpeed: 700,
            smartSpeed: 2000,
            responsiveClass: true,
            autoplayHoverPause: true,
            autoplayTimeout: 9000,
            responsive: {
                0: {
                    items: 1,
                    margin: 0,
                },
                600: {
                    items: 1,
                    margin: 0,
                },
                1000: {
                    items: 1,
                    margin: 0,
                }
            }
        });

        $('.right-over-next').on("click", function () {
            workSlide.trigger('next.owl.carousel');
        })
        $('.right-over-prev').on("click", function () {
            workSlide.trigger('prev.owl.carousel');
        })
    }

    //--------------------------------------------------
    // Toggle Menu
    //--------------------------------------------------
    var t1 = new TimelineMax({
        paused: true
    });
    t1.to(".one", 0.25, {
        y: 9,
        autoAlpha: 0,
        ease: Expo.easeInOut
    });
    t1.to(".two", 0.15, {
        ease: Expo.easeInOut,
        delay: -0.3
    });
    t1.to(".tre", 0.25, {
        y: -9,
        autoAlpha: 0,
        ease: Expo.easeInOut,
        delay: -0.6
    });
    t1.to(".over-all", 0.1, {
        autoAlpha: 1,
        ease: Expo.easeOut,
    })
    t1.to(".bg-nav", 1, {
        autoAlpha: 1,
        ease: Power4.easeOut,
        delay: -1
    })


    t1.to(".menu", 1, {
        autoAlpha: 1,
        ease: Expo.easeOut,
        delay: -1
    })

    t1.staggerFrom(".menu ul li", 1.5, {
        y: 50,
        opacity: 0,
        ease: Power4.easeInOut,
    }, '0.1', '-0.01');


    t1.reverse();
      $('.toggle-btn').on("click", function () {
        t1.reversed(!t1.reversed()); //toggles the orientation
    })
  

    //--------------------------------------------------
    // Magnetic
    //--------------------------------------------------

    $(document).on('mousemove', function (e) {
        $('.magnetic').each(function () {
            if (!isMobile) {
                magnetic(this, e); //Init effect magnetic 
            }
        });
    });

    function magnetic(el, e) {
        var mX = e.pageX,
            mY = e.pageY;
        const obj = $(el);

        const customDist = 20 * obj.data('dist') || 80,
            centerX = obj.offset().left + obj.width() / 2,
            centerY = obj.offset().top + obj.height() / 2;

        var deltaX = Math.floor((centerX - mX)) * -.4,
            deltaY = Math.floor((centerY - mY)) * -.4;

        var distance = calcDistance(obj, mX, mY);

        if (distance < customDist) {
            TweenMax.to(obj, .4, {
                y: deltaY,
                x: deltaX
            });
        } else {
            TweenMax.to(obj, .4, {
                y: 0,
                x: 0
            });
        }
    }

    function calcDistance(elem, mouseX, mouseY) {
        return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left + (elem.width() / 2)), 2) + Math.pow(mouseY - (elem.offset().top + (elem.height() / 2)), 2)));
    }
    let launchDate = new Date("Nov 3, 2023 00:00:00").getTime();

// Setup Timer to tick every 1 second
let timer = setInterval(tick, 1000);

function tick () {
  // Get current time
  let now = new Date().getTime();
  // Get the difference in time to get time left until reaches 0
  let t = launchDate - now;

  // Check if time is above 0
  if (t > 0) {
    // Setup Days, hours, seconds and minutes
    // Algorithm to calculate days...
    let days = Math.floor(t / (1000 * 60 * 60 * 24));
    // prefix any number below 10 with a "0" E.g. 1 = 01
    if (days < 10) { days = "0" + days; }
    
    // Algorithm to calculate hours
    let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (hours < 10) { hours = "0" + hours; }

    // Algorithm to calculate minutes
    let mins = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    if (mins < 10) { mins = "0" + mins; }

    // Algorithm to calc seconds
    let secs = Math.floor((t % (1000 * 60)) / 1000);
    if (secs < 10) { secs = "0" + secs; }

    // Create Time String
    let time = `${days} : ${hours} : ${mins} : ${secs}`;

    // Set time on document
    document.querySelector('.countdown-inside').innerText = time;
  }
}    

    //--------------------------------------------------
    // Zoom Image
    //--------------------------------------------------

    mediumZoom(document.querySelectorAll('.cover'), {
        background: '#000',
    })

    var workSlide = new Swiper('.swiper-container', {

        slidesPerView: 1,
        pagination: {
            el: '.swiper-pagination',
            type: 'progressbar',
          },
        loop: false,
        centeredSlides: false,
        speed: 900,
        spaceBetween: 0,
        mousewheel: true,

    });

    workSlide.on('slideChange', function () {
        TweenMax.to('.text-1', 0.3, {
            y: '80',
         
        })
        TweenMax.to('.text-2', 0.3, {
            y: '80',
         
        })

      
        
    });

    workSlide.on('slideChangeTransitionEnd', function () {
        TweenMax.to('.text-1', 0.3, {
            y: '0',
         
        })
        TweenMax.to('.text-2', 0.3, {
            y: '0',
         
        })
   
    });



    var toggler = $('.menu__toggler');
    var menu = $('.menus');
    toggler.on("click", function () {
        toggler.toggleClass('activez');
        menu.toggleClass('activez');
    });

})(jQuery);