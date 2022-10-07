$(document).ready(function() {
    var currentURL = window.location.href;

    $(".header__navbar").first().children("a").each(function(index) {

        console.log(this.innerHTML);
        console.log(currentURL);
        if (this.href == currentURL) {
            $(this).addClass("header__button--active");
        }
    });
    
});