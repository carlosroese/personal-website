let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});
$('html').css("overflow-y", "hidden");

$(document).ready(function () {
    $(".bgDesignProcess").slick({
        lazyLoad: 'ondemand', // ondemand progressive anticipated
        infinite: false,
        arrows: false,
        autoplay: false,
        dots: false,
        autoplaySpeed: 600,
        speed: 500,
        pauseOnHover: false,
        slidesToShow: 2,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 761,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
    $('.processFoward').click(function () {
        $('.bgDesignProcess').slick('slickNext');
    })
    $('.processBack').click(function () {
        $('.bgDesignProcess').slick('slickPrev');
    })

    $("html, body").scrollTop(0);
    var skew = function () {
        $(".banner .skew").addClass("skewStart");
        $('html').css("overflow-y", "auto");
    };
    setTimeout(skew, 2200);

    var arrow = function () {
        $('.arrowDown').css("opacity", "0.3");
        $('#ancorText').addClass("ancorTextMargin");
    };
    setTimeout(arrow, 3500);

    $(window).scroll(function () {
        var scrollval = $(this).scrollTop();    // It will return scroll value
        var ancorCase1 = $('.bgCase').offset().top;
        var ancorCase2 = $('.bgCase2').offset().top;
        var ancorCase3 = $('.bgCase3').offset().top;
        var ancorCreative = $('.bgProcess').offset().top;
        console.log((ancorCase1 - scrollval));
        $(".banner .skew").css("transition", "0s");
        $(".banner .contLeft .overflow").css("margin-left", - (scrollval / 2) + 'px');
        $(".banner .contLeft .overflow").css("opacity", (1 - (scrollval / 300)));
        $(".banner .iconHome").css("margin-left", - (scrollval / 2) + 'px');
        $(".banner .iconHome").css("opacity", (1 - (scrollval / 300)));
        $(".banner .contRight .overflow").css("margin-left", + (scrollval / 2) + 'px');
        $(".banner .contRight .overflow").css("opacity", (1 - (scrollval / 500)));
        $(".banner .arrowDown").css("left", (4 - (scrollval / 10)) + 'vw');
        $(".inicialText h1").css("opacity", (0.3 + (scrollval / 900)));        

        if (scrollval > 500) {
            $('.logoPrincipal').addClass('logoBranco');
            $('.btMenu').addClass('btMenuBranco');
            $('.btIdioma .bt').addClass('btIdiomaBranco');
        } else {
            $('.logoPrincipal').removeClass('logoBranco');
            $('.btMenu').removeClass('btMenuBranco');
            $('.btIdioma .bt').removeClass('btIdiomaBranco');
        }
        if ($(window).width() > 1670) {
            var spaceImgCase1 = -300;
            var spaceImgCase2 = -400;
            var spaceImgCase3 = -510;

            var spaceTextCase1 = 370;
            var spaceTextCase2 = 580;
            var spaceTextCase3 = 750;
        }
        if ($(window).width() < 1610) {
            var spaceImgCase1 = -230;
            var spaceImgCase2 = -330;
            var spaceImgCase3 = -450;

            var spaceTextCase1 = 300;
            var spaceTextCase2 = 450;
            var spaceTextCase3 = 600;
        }
        if ($(window).width() < 1450) {
            var spaceImgCase1 = -260;
            var spaceImgCase2 = -340;
            var spaceImgCase3 = -440;
        }
        if ($(window).width() < 1370) {
            var spaceImgCase1 = -220;
            var spaceImgCase2 = -300;
            var spaceImgCase3 = -360;

            var spaceTextCase1 = 270;
            var spaceTextCase2 = 400;
            var spaceTextCase3 = 500;
        }
        if ($(window).width() < 769) {
            var spaceImgCase1 = -220;
            var spaceImgCase2 = -300;
            var spaceImgCase3 = -390;

            var spaceTextCase1 = 100;
            var spaceTextCase2 = 290;
            var spaceTextCase3 = 400;
            $(".banner .skew").css("top", (38 - (scrollval / 10)) + '%');
        }

        if ($(window).width() > 761) {
            $(".banner .skew").css("left", (50 - (scrollval / 10)) + 'vw');
        }
        // SHOW CASES
        $('.bgCase .imgWeb').css("bottom", (spaceImgCase1 + (scrollval / 8) + 'px'));
        $('.bgCase2 .imgWeb').css("bottom", (spaceImgCase2 + (scrollval / 8) + 'px'));
        $('.bgCase3 .imgWeb').css("bottom", (spaceImgCase3 + (scrollval / 8) + 'px'));
        if (scrollval >= (ancorCase1 - (scrollval / 5))) {
            $('.bgCase .contentLeft .overflow h2').addClass('titleVisivel');
            $('.bgCase .contentLeft .overflow p').addClass('textVisivel');
            $('.bgCase .contentLeft').css("top", (0 - (scrollval / 5) + spaceTextCase1) + 'px');
        }
        else {
            $('.bgCase .contentLeft .overflow h2').removeClass('titleVisivel');
            $('.bgCase .contentLeft .overflow p').removeClass('textVisivel');
        }

        if (scrollval >= (ancorCase2 - (scrollval / 8))) {
            $('.bgCase2 .contentLeft .overflow h2').addClass('titleVisivel');
            $('.bgCase2 .contentLeft .overflow p').addClass('textVisivel');
            $('.bgCase2 .contentLeft').css("top", (0 - (scrollval / 5) + spaceTextCase2) + 'px');
        }
        else {
            $('.bgCase2 .contentLeft .overflow h2').removeClass('titleVisivel');
            $('.bgCase2 .contentLeft .overflow p').removeClass('textVisivel');
        }

        if (scrollval >= (ancorCase3 - (scrollval / 12))) {
            $('.bgCase3 .contentLeft .overflow h2').addClass('titleVisivel');
            $('.bgCase3 .contentLeft .overflow p').addClass('textVisivel');
            $('.bgCase3 .contentLeft').css("top", (0 - (scrollval / 5) + spaceTextCase3) + 'px');
        }
        else {
            $('.bgCase3 .contentLeft .overflow h2').removeClass('titleVisivel');
            $('.bgCase3 .contentLeft .overflow p').removeClass('textVisivel');
        }

        if (scrollval >= ancorCreative) {
            $('.logoPrincipal').addClass('logoBrancoPreto');
            $('.btMenu').addClass('btMenuPreto');
            $('.btWhats').addClass('btWhatsPreto');
            $('.btIdioma .bt').addClass('btIdiomaPreto');
        }
        else {
            $('.logoPrincipal').removeClass('logoBrancoPreto');
            $('.btMenu').removeClass('btMenuPreto');
            $('.btWhats').removeClass('btWhatsPreto');
            $('.btIdioma').removeClass('btIdiomaPreto');
        }
    });

    $(".btMenu").click(function () {
        $(".bgMenuPrincipal").addClass("bgMenuPrincipalAberto");
        $(".menuPrincipal").addClass("menuPrincipalAberto");
        $('html').css("overflow-y", "hidden");
    });
    $(".btFecharMenu").click(function () {
        $(".bgMenuPrincipal").removeClass("bgMenuPrincipalAberto");
        $(".menuPrincipal").removeClass("menuPrincipalAberto");
        $('html').css("overflow-y", "auto");
    });

    $(".idiomaPt").click(function () {
        $('body').append( $('<script src="scripts/pt.js"></script>'));
        
    });


    $("a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function () {
                window.location.hash = hash;
            });
        }
    });
});


function fixedCases() {
    var window_top = $(window).scrollTop();
    var ancorText = $('#ancorText').offset().top;
    var alturaText = $('.inicialText').height();
    var ancorCase = $('#ancorCase').offset().top;
    var alturaCase = $('.bgCase').height();
    var ancorCase2 = $('#ancorCase2').offset().top;
    var alturaCase2 = $('.bgCase2').height();
    var ancorCase3 = $('#ancorCase3').offset().top;
    var alturaCase3 = $('.bgCase3').height();
    // console.log(alturaCase);
    if (window_top > ancorText) {
        $('.inicialText').addClass('initialTextFixed');
        $('#ancorCase').css("margin-top", alturaText + "px");
    } else {
        $('.inicialText').removeClass('initialTextFixed');
        $('#ancorCase').css("margin-top", "0");
    }

    if (window_top >= ancorCase) {
        $('.bgCase').addClass('bgCaseFixed');
        $('#ancorCase2').css("margin-top", alturaCase + alturaText);
    } else {
        $('.bgCase').removeClass('bgCaseFixed');
        $('#ancorCase2').css("margin-top", "0");
    }

    if (window_top > ancorCase2) {
        $('.bgCase2').addClass('bgCaseFixed');
        $('#ancorCase3').css("margin-top", alturaCase + alturaCase2 + alturaText);
    } else {
        $('.bgCase2').removeClass('bgCaseFixed');
        $('#ancorCase3').css("margin-top", "0");
    }

    if (window_top > ancorCase3) {
        $('.bgCase3').addClass('bgCaseFixed');
        $('.bgProcess').css("margin-top", alturaCase + alturaCase2 + alturaCase3 + alturaText);
    } else {
        $('.bgCase3').removeClass('bgCaseFixed');
        $('.bgProcess').css("margin-top", "0");
    }

}

$(window).scroll(function () {
    fixedCases();
});

// function moveImgCases() {
//     var window_top = $(window).scrollTop();
//     var ancorCase1 = $('.bgCase').offset().top;
//     if (window_top > ancorCase1) {
//         $('.bgCase .imgWeb').css("top", - (scrollval / 10) + 'px');
//     } else {
//         $('.bgCase .imgWeb').css("top", + (scrollval / 10) + 'px');
//     }
// }
// $(window).scroll(function () {
//     moveImgCases();
// });