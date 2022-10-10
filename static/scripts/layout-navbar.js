function showTabletMenu() {
    $(".header__button").toggleClass("header__button-tablet--visible");
}

function screenWidth() {
    $("#contact").html(`${screen.width} px`);
}

$(document).ready(function() {
    var currentURL = window.location.href;

    $(".header__navbar").eq(0).children("a").each(function(index) {

        if (this.href == currentURL) {
            $(this).addClass("header__button--active");
        }
    });

    var widthTimer = setInterval(screenWidth, 100);
    
});

window.onscroll = function() {
    if (document.body.scrollTop > 90 || document.documentElement.scrollTop > 90) {
        console.log("Displaying tiny header");
        $(".header").addClass("header--tiny");
        $(".header__icon").addClass("header__icon--tiny");
        $(".header__button").addClass("header__button--tiny");
    } else {
        console.log("Displaying big header");
        $(".header").removeClass("header--tiny");
        $(".header__icon").removeClass("header__icon--tiny");
        $(".header__button").removeClass("header__button--tiny");
    }
}