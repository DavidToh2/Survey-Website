
let maxSlides = 3, slideNo = 1;

                /* SLIDE-RELATED FUNCTIONS */

function formatSlides() {
    var slides = $(".slide");
    for (i = 1; i <= maxSlides; i++) {
        slides.eq(i-1).children(".slide__number").first().html(`${i} / ${maxSlides}`);
    }

    console.log("Slide formatting finished!")
}

function showSlide(n) {
    var slides = $(".slide");
    for (i = 1; i <= maxSlides; i++) {
        slides.eq(i-1).hide();
    }
    slides.eq(n-1).show();
}

function incrementSlide(n) {
    slideNo = modulo(slideNo + n, maxSlides)
    showSlide(slideNo);
}

                /* Basic functions */

function file_exists(filepath) {
    $.get(filepath)
    .done(function() {
        return true
    })
    .fail(function() {
        return false
    })
}

$(document).ready(function() {
    formatSlides();
    showSlide(slideNo);

    currentCardArray = [0];
    initCardDisplay(0);
});