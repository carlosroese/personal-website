
var arrLang = new Array();
arrLang['en'] = new Array();
arrLang['pt'] = new Array();

// Inglês
arrLang['en']['hello']= "Hello";
arrLang['en']['im']= "I`m Carlos";
arrLang['en']['icreate']= "I create amazing designs for humans!";
arrLang['en']['about']= " <b>My work is done in an integrated way with my costumers workflow.</b> Not as an outsider, but as a part of their team and working together.";
arrLang['en']['titleBanner1']= "A Senior UX/UI,";
arrLang['en']['titleBanner2']= "Brand and Graphic";
arrLang['en']['titleBanner3']= "Designer";
arrLang['en']['case1Title1']= "Web";
arrLang['en']['case1Title2']= "Design";
arrLang['en']['case1Text']= "Websites, E-commerces, Softwares and Apps. People-focused projects on which the usability is the key to provide an amazing experience.";
arrLang['en']['case2Title1']= "Mobile";
arrLang['en']['case2Title2']= "Apps";
arrLang['en']['case2Text']= "How about giving life to your ideas? It doesn’t matter your work area, I’m going to help you achieve your goals. From sketch to launch.";
arrLang['en']['case3Title1']= "Brand &";
arrLang['en']['case3Title2']= "Graphic";
arrLang['en']['case3Text']= "Your client has a visual brand identity and is well established on the market, what about you? How do you want to be seen? Gather more value to your business and product.";
arrLang['en']['titleCreative']= "Creative<br>Process";
arrLang['en']['someClients']= "Some clients<br>and partners";
arrLang['en']['letsWork']= "Let`s work<br>togheter";
arrLang['en']['btSayHi']= "Say hi";
arrLang['en']['btSeeMyWork']= "See my work";
arrLang['en']['copyright']= "©2020 Carlos Roese. Thank you for your visit :)";
arrLang['en']['btMyProcess']= "My process";
arrLang['en']['btMyWork']= "My work";
arrLang['en']['titleSayHi']= "Say Hi!";
arrLang['en']['seeMyWorkTitle']= "See my Work";

// Português
arrLang['pt']['hello']= "Olá,";
arrLang['pt']['im']= "tudo bem?";
arrLang['pt']['icreate']= "Meu nome é Carlos :)";
arrLang['pt']['titleBanner1']= "Designer UX/UI";
arrLang['pt']['titleBanner2']= "e Designer Gráfico";
arrLang['pt']['titleBanner3']= "há mais de 13 anos";
arrLang['pt']['about']= "<b>Meu trabalho é realizado de forma integrada com meus clientes e de acordo com o seu workflow.</b> Não como um profissional terceirizado, mas como parte da equipe.";
arrLang['pt']['case1Title1']= "Web";
arrLang['pt']['case1Title2']= "Design";
arrLang['pt']['case1Text']= "Websites, Lojas Virtuais, Sistemas e Aplicativos Web. Projetos focados em pessoas onde a usabilidade é a chave para proporcionar uma experiência incrível.";
arrLang['pt']['case2Title1']= "Apps";
arrLang['pt']['case2Title2']= "Mobile";
arrLang['pt']['case2Text']= "Que tal dar vida para aquela sua ideia? Não importa qual seu ramo de negócio, eu vou ajudar você a alcançar seu objetivo. Do rabisco no papel até o lançamento.";
arrLang['pt']['case3Title1']= "Design";
arrLang['pt']['case3Title2']= "Gráfico";
arrLang['pt']['case3Text']= "Seu cliente possui uma identidade visual e está bem posicionado no mercado, e você? Como você deseja ser visto? Agregue muito mais valor ao seu negócio ou produto.";
arrLang['pt']['titleCreative']= "Processo<br>Criativo";
arrLang['pt']['someClients']= "Alguns clientes<br>e parceiros";
arrLang['pt']['letsWork']= "Vamos trabalhar<br>juntos?";
arrLang['pt']['btSayHi']= "Manda um oi!";
arrLang['pt']['btSeeMyWork']= "Meus trabalhos";
arrLang['pt']['copyright']= "©2020 Carlos Roese. Obrigado pela visita :)";
arrLang['pt']['btMyProcess']= "Meu processo";
arrLang['pt']['btMyWork']= "Meus trabalhos";
arrLang['pt']['titleSayHi']= "Manda um oi!";
arrLang['pt']['seeMyWorkTitle']= "Conheça meu trabalho";

// Process translation
$(function () {
    $('.btIdioma .bt').click(function () {
        var lang = $(this).attr('id');
        $('.lang').each(function (index, item) {
            $(this).html(arrLang[lang][$(this).attr('key')]);
        });
    }); 
});
$('.idiomaPt').click(function () {
    $(this).hide();
    $('.idiomaEn').css("display", "flex");
});
$('.idiomaEn').click(function () {
    $(this).hide();
    $('.idiomaPt').css("display", "flex");
});