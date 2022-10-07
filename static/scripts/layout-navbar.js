$(document).ready(function() {
    var currentURL = window.location.href;

    $(".header__navbar").eq(0).children("a").each(function(index) {

        if (this.href == currentURL) {
            $(this).addClass("header__button--active");
        }
    });
    
});