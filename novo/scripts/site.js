let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});
// $('html').css("overflow-y", "hidden");



//HORIZONTAL SCROLL=====================
if ($(window).width() > 1023) {
    const stickySections = [...document.querySelectorAll('.sticky')]

    window.addEventListener('scroll', (e) => {
        for (let i = 0; i < stickySections.length; i++) {
            transform(stickySections[i])
        }
    })

    function transform(section) {
        const offsetTop = section.parentElement.offsetTop;
        const scrollSection = section.querySelector('.scrollSection')


        let percentage = ((window.scrollY - offsetTop) / window.innerHeight) * 100;
        percentage = percentage < 0 ? 0 : percentage > 180 ? 180 : percentage;
        scrollSection.style.transform = `translate3d(${-(percentage)}vw, 0, 0)`
    }
}

//END HORIZONTAL SCROLL=====================



$(document).ready(function () {
    $("html, body").scrollTop(0);
    var skew = function () {
        $('html').css("overflow-y", "auto");
    };
    setTimeout(skew, 3000);

    var startLogoLetters = function () {
        $('.startAnimation .logoSpace .pathLeft').addClass("pathLeftActive");
        $('.startAnimation .logoSpace .pathRight').addClass("pathRightActive");
    };
    setTimeout(startLogoLetters, 200);

    var startLogoAnimation = function () {
        $('.startAnimation .logoSpace').addClass("logoSpaceActive");
    };
    setTimeout(startLogoAnimation, 1200);

    var startLogoHide = function () {
        $('.startAnimation').css("display", "none");
    };
    setTimeout(startLogoHide, 2900);

    var headerShows = function () {
        $('.header').addClass("headerAtive");
    };
    setTimeout(headerShows, 1200);

    var smallPreHeaders = function () {
        $('.hero .smallText p').addClass("preHeaderActive");
        $('.hero .smallText .left').addClass("leftActive");
        $('.hero .smallText .right').addClass("rightActive");
    };
    setTimeout(smallPreHeaders, 2000);

    var headline1 = function () {
        $('.hero .step1 h2').css("margin-top", "0px");
    };
    setTimeout(headline1, 1700);

    var headline2 = function () {
        $('.hero .step2 h2').css("margin-top", "0px");
    };
    setTimeout(headline2, 1800);

    var headline3 = function () {
        $('.hero .step3 h2').css("margin-top", "0px");
    };
    setTimeout(headline3, 1900);

    var subH1 = function () {
        $('.hero .sub-h1').addClass("sub-h1Active");
        $('.hero .defaultCTA').css("opacity", "1");
    };
    setTimeout(subH1, 2000);

    var avatar = function () {
        $('.hero img').addClass("avatarActive");
    };
    setTimeout(avatar, 2300);

    $(window).scroll(function () {
        var scrollval = $(this).scrollTop();    // It will return scroll value
        // var anchorAbout = $('.about').offset().top;
        var anchorAboutCarlos = $('.aboutCarlos').offset().top;
        var anchorProjects = $('.projects').offset().top;
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

        if (scrollval >= anchorFooter) {
            $('.header').addClass('headerNeon');
            $('.header .defaultCTA').addClass('defaultCTANeon');
        }
        //END HEADER CHANGING OF COLOR ON SCROLL


        //Hero Headlines as you scroll
        if ($(window).width() < 1024) {
            var myPictureSpeed = 7;
        } else {
            var myPictureSpeed = 2;
        }
        $(".hero .step1").css("margin-left", - (scrollval / 1) + 'px');
        $(".hero .step2").css("margin-right", - (scrollval / 1) + 'px');
        $(".hero .step3").css("margin-left", - (scrollval / 1) + 'px');


        //About Section Animations as you scroll
        $(".about .big15Years .myPicture").css("top", (0 - (scrollval / myPictureSpeed)) + 'px');
        if ($(window).width() < 1024) {
            var freeHandRedSpeed = 250;
        } else {
            var freeHandRedSpeed = 200;
        }
        $(".about .freehandred").css("rotate", (-(scrollval / freeHandRedSpeed)) + 'deg');
        $(".about .freehandred").css("margin-top", (scrollval / 15) + 'px');

        if ($(window).width() < 1024) {
            var curveArrowTriggerPlace = 0.7;
        } else {
            var curveArrowTriggerPlace = 0.7;
        }
        if (scrollval >= (anchorAboutCarlos * curveArrowTriggerPlace)) {
            $(".curveArrow svg").css("display", 'block');
            // alert("asasas");
        }


        //PROJECTS ANIMATIONS AS SCROLL
        let projectsHeadlineTriggerAnimation = window.innerHeight * 0.80;
        if (scrollval >= (anchorProjects - projectsHeadlineTriggerAnimation)) {
            $('.projects .headline').addClass("headlineActive");
        } else {
            $('.projects .headline').removeClass("headlineActive");
        }

        //SERVICES ANIMATIONS AS SCROLL
        if (scrollval >= anchorServices) {
            $('.bgServices .curveArrow').css("display", 'block');
        }


        //CLIENTS ANIMATIONS AS SCROLL
        let clientsHeadlineTriggerAnimation = window.innerHeight * 0.80;
        if (scrollval >= (anchorClients - clientsHeadlineTriggerAnimation)) {
            $('.bgClients .headline').addClass("headlineActive");
        } else {
            $('.bgClients .headline').removeClass("headlineActive");
        }


        //CTA Break Animations
        if (scrollval >= (anchorCtaBreak - 300)) {

            $(".ctaBreak").css("margin-bottom", (anchorCtaBreak - (scrollval)) + 'px');

            var gifExplode = function () {
                $('.ctaBreak .gif1').addClass('gif1Active');
                $('.ctaBreak .gif2').addClass('gif2Active');
                $('.ctaBreak .gif3').addClass('gif3Active');
                $('.ctaBreak .gif4').addClass('gif4Active');
            };
            setTimeout(gifExplode, 1300);

            var ctaBreakHead3 = function () {
                $('.ctaBreak .freehand').addClass('freehandActive');
            };
            setTimeout(ctaBreakHead3, 0);

            var ctaBreakHead1 = function () {
                $('.ctaBreak .mask .head1').addClass("h2Active");
            };
            setTimeout(ctaBreakHead1, 200);

            var ctaBreakHead2 = function () {
                $('.ctaBreak .mask .head2').addClass("h2Active");
            };
            setTimeout(ctaBreakHead2, 400);

            var ctaBreakHead3 = function () {
                $('.ctaBreak .mask .head3').addClass("h2Active");
            };
            setTimeout(ctaBreakHead3, 600);

            var ctaBreakButton = function () {
                $('.ctaBreak .defaultCTA').addClass("defaultCTAActive");
            };
            setTimeout(ctaBreakButton, 800);

        } else {
            $('.ctaBreak .gif1').removeClass('gif1Active');
            $('.ctaBreak .gif2').removeClass('gif2Active');
            $('.ctaBreak .gif3').removeClass('gif3Active');
            $('.ctaBreak .gif4').removeClass('gif4Active');
            $('.ctaBreak .freehand').removeClass('freehandActive');
            $('.ctaBreak .mask .head1').removeClass("h2Active");
            $('.ctaBreak .mask .head2').removeClass("h2Active");
            $('.ctaBreak .mask .head3').removeClass("h2Active");
            $('.ctaBreak .defaultCTA').removeClass("defaultCTAActive");
        }
        //Footer Animations
        if (scrollval >= 10) {
            var footerTitle1 = function () {
                $('.bgFooter .headline .box1 h2').addClass("h2ActiveFooter");
            };
            setTimeout(footerTitle1, 100);

            var footerTitle2 = function () {
                $('.bgFooter .headline .box2 h2').addClass("h2ActiveFooter");
            };
            setTimeout(footerTitle2, 200);

            var footerTitle3 = function () {
                $('.bgFooter .headline .box3 h2').addClass("h2ActiveFooter");
            };
            setTimeout(footerTitle3, 300);

            var footerCTAs = function () {
                $('.bgFooter .headline .box').addClass("boxActive");
                $('.bgFooter .headline .defaultCTA').css("opacity", '1');
                $('.bgFooter .ctas').css("opacity", '1');
            };
            setTimeout(footerCTAs, 700);

            var copyrightShow = function () {
                $('.bgFooter .copyright').css("opacity", "1");
            };
            setTimeout(copyrightShow, 1000);
        }


    });
});

var elem = document.querySelector('.myPicture');
window.addEventListener('scroll', function () {
    var value = window.scrollY * 0.015;
    elem.style.transform = `translatex(0%) translatey(0%) rotate(${value}deg)`;
});





if ($(window).width() > 1023) {
    //ABOUT TEXT LETTERS ANIMATION
    document.addEventListener('DOMContentLoaded', function () {
        const heading = document.getElementById('animatedText');
        const container = document.getElementById('aboutMe');
        const text = heading.textContent;
        let aboutTextTriggerSpace = window.innerHeight * 0.70;
        heading.textContent = ''; // Limpa o texto original
        const menuLinks = document.querySelectorAll('.hasAnchorLink'); //usado nas animações anchor do menu

        function typeLetter() {
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'letter';
                span.style.animationDelay = `${index * 0.05}s`; // Ajusta o atraso para cada letra
                heading.appendChild(span);
            });
        }

        function checkScroll() {
            const containerPosition = container.getBoundingClientRect().top + window.scrollY;
            const scrollPosition = window.scrollY;
            if (scrollPosition >= (containerPosition - aboutTextTriggerSpace)) {
                heading.classList.add('visible');
                typeLetter();
                window.removeEventListener('scroll', checkScroll); // Remove o evento para evitar múltiplas execuções
            }
        }

        window.addEventListener('scroll', checkScroll);

        menuLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault(); // Previne o comportamento padrão do link

                const targetId = this.getAttribute('href').substring(1); // Obtém o ID da seção alvo
                const targetSection = document.getElementById(targetId);

                // Scroll suave para a seção alvo
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    });
}



// Muda o Ano no copyright
const currentYearElement = document.getElementById('currentYear');
const currentYear = new Date().getFullYear();
currentYearElement.textContent = currentYear;
// Fim


if ($(window).width() < 1023) {
    document.addEventListener('DOMContentLoaded', function () {
        const heading = document.getElementById('animatedText');
        const container = document.getElementById('aboutMe');
        const text = heading.textContent;
        let aboutTextTriggerSpace = window.innerHeight * 2;
        heading.textContent = ''; // Limpa o texto original
        const menuLinks = document.querySelectorAll('.hasAnchorLink'); //usado nas animações anchor do menu

        function typeLetter() {
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char;
                span.className = 'letter';
                span.style.animationDelay = `${index * 0.05}s`; // Ajusta o atraso para cada letra
                heading.appendChild(span);
            });
        }

        function checkScroll() {
            const containerPosition = container.getBoundingClientRect().top + window.scrollY;
            const scrollPosition = window.scrollY;
            if (scrollPosition >= (containerPosition - aboutTextTriggerSpace)) {
                heading.classList.add('visible');
                typeLetter();
                window.removeEventListener('scroll', checkScroll); // Remove o evento para evitar múltiplas execuções
            }
        }

        window.addEventListener('scroll', checkScroll);

        menuLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault(); // Previne o comportamento padrão do link

                const targetId = this.getAttribute('href').substring(1); // Obtém o ID da seção alvo
                const targetSection = document.getElementById(targetId);

                // Scroll suave para a seção alvo
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    });
}