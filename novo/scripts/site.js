let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});
$('html').css("overflow-y", "hidden");



//HORIZONTAL SCROLL=====================
const stickySections = [...document.querySelectorAll('.sticky')]

window.addEventListener('scroll', (e) => {
    for(let i = 0; i < stickySections.length; i++){
        transform(stickySections[i])
    }
})

function transform(section){
    const offsetTop = section.parentElement.offsetTop;
    const scrollSection = section.querySelector('.scrollSection')


    let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;
    percentage = percentage < 0 ? 0 : percentage > 180 ? 180 : percentage;
    scrollSection.style.transform = `translate3d(${-(percentage)}vw, 0, 0)`
}
//END HORIZONTAL SCROLL=====================



$(document).ready(function () {
    $("html, body").scrollTop(0);
    var skew = function () {
        $('html').css("overflow-y", "auto");
    };
    setTimeout(skew, 0);

    var headerShows = function () {
        $('.header').css("margin-top", "39px");
    };
    setTimeout(headerShows, 0);

    var smallPreHeaders = function () {
        $('.hero .smallText p').css("margin-right", "22vw");
        $('.hero .smallText .left').css("margin-left", "22vw");
        $('.hero .smallText p').css("opacity", "1");
    };
    setTimeout(smallPreHeaders, 1000);  

    var headline1 = function () {
        $('.hero .step1 h2').css("margin-top", "0px");
    };
    setTimeout(headline1, 400);

    var headline2 = function () {
        $('.hero .step2 h2').css("margin-top", "0px");
    };
    setTimeout(headline2, 500);

    var headline3 = function () {
        $('.hero .step3 h2').css("margin-top", "0px");
    };
    setTimeout(headline3, 600);

    var subH1 = function () {
        $('.hero .sub-h1').css("margin-top", "1vw");
        $('.hero .sub-h1').css("opacity", "1");
    };
    setTimeout(subH1, 1000);

    var avatar = function () {
        $('.hero img').css("margin-top", "-9vw");
    };
    setTimeout(avatar, 1000);

    


    $(window).scroll(function () {
        var scrollval = $(this).scrollTop();    // It will return scroll value
        var anchorServices = $('.bgServices').offset().top;
        var anchorClients = $('.bgClients').offset().top;
        var anchorCtaBreak = $('.ctaBreak').offset().top;
        var anchorFooter = $('.bgFooter').offset().top;


        //HEADER CHANGING OF COLOR ON SCROLL
        if (scrollval < anchorServices) {
            $('.header').removeClass('headerNeon');
            $('.header .defaultCTA').removeClass('defaultCTANeon');
        } 

        if (scrollval >= anchorServices) {
            $('.header').addClass('headerNeon');
            $('.header .defaultCTA').addClass('defaultCTANeon');
        } 

        if (scrollval > anchorClients) {
            $('.header').removeClass('headerNeon');
            $('.header .defaultCTA').removeClass('defaultCTANeon');
        } 
        
        if (scrollval > anchorFooter) {
            $('.header').addClass('headerNeon');
            $('.header .defaultCTA').addClass('defaultCTANeon');
        }
        
        //Hero Headlines as you scroll
        $(".hero .step1").css("margin-left", - (scrollval / 1) + 'px');
        $(".hero .step2").css("margin-right", - (scrollval / 1) + 'px');
        $(".hero .step3").css("margin-left", - (scrollval / 1) + 'px');


        //About Section Animations as you scroll
        $(".about .big15Years .myPicture").css("top", (0 - (scrollval / 2)) + 'px');

        //CTA Break gets sticky
        // if (scrollval >= anchorCtaBreak) {
        //     $('.ctaBreak').css("position", 'fixed');;
        // } 


    });
});

var elem = document.querySelector('.myPicture');
window.addEventListener('scroll', function() {
	var value = window.scrollY * 0.015;
	elem.style.transform = `translatex(0%) translatey(0%) rotate(${value}deg)`; 
});

// function fixedCases() {
//     var window_top = $(window).scrollTop();
//     var ancorText = $('#ancorText').offset().top;
//     var alturaText = $('.inicialText').height();
//     var ancorCase = $('#ancorCase').offset().top;
//     var alturaCase = $('.bgCase').height();
//     var ancorCase2 = $('#ancorCase2').offset().top;
//     var alturaCase2 = $('.bgCase2').height();
//     var ancorCase3 = $('#ancorCase3').offset().top;
//     var alturaCase3 = $('.bgCase3').height();
//     // console.log(alturaCase);
//     if (window_top > ancorText) {
//         $('.inicialText').addClass('initialTextFixed');
//         $('#ancorCase').css("margin-top", alturaText + "px");
//     } else {
//         $('.inicialText').removeClass('initialTextFixed');
//         $('#ancorCase').css("margin-top", "0");
//     }

//     if (window_top >= ancorCase) {
//         $('.bgCase').addClass('bgCaseFixed');
//         $('#ancorCase2').css("margin-top", alturaCase + alturaText);
//     } else {
//         $('.bgCase').removeClass('bgCaseFixed');
//         $('#ancorCase2').css("margin-top", "0");
//     }

//     if (window_top > ancorCase2) {
//         $('.bgCase2').addClass('bgCaseFixed');
//         $('#ancorCase3').css("margin-top", alturaCase + alturaCase2 + alturaText);
//     } else {
//         $('.bgCase2').removeClass('bgCaseFixed');
//         $('#ancorCase3').css("margin-top", "0");
//     }

//     if (window_top > ancorCase3) {
//         $('.bgCase3').addClass('bgCaseFixed');
//         $('.bgProcess').css("margin-top", alturaCase + alturaCase2 + alturaCase3 + alturaText);
//     } else {
//         $('.bgCase3').removeClass('bgCaseFixed');
//         $('.bgProcess').css("margin-top", "0");
//     }

// }

// $(window).scroll(function () {
//     fixedCases();
// });

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