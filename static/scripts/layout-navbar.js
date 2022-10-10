$(document).ready(function() {
    var currentURL = window.location.href;

    $(".header__navbar").eq(0).children("a").each(function(index) {

        if (this.href == currentURL) {
            $(this).addClass("header__button--active");
        }
    });
    
});

window.onscroll = function() {
    if (document.body.scrollTop > 90 || document.documentElement.scrollTop > 90) {
        console.log("Displaying tiny header");
        $(".header__icon").addClass("header__icon--tiny");
        $(".header__title").addClass("header__title--tiny");
    } else {
        console.log("Displaying big header");
        $(".header__icon").removeClass("header__icon--tiny");
        $(".header__title").removeClass("header__title--tiny");
    }
}