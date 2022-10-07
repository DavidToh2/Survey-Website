
let slideNo = 1;
let maxSlides = 3;

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
    slideNo = n;
}

function incrementSlide(n) {
    let newSlideNo = slideNo + n;
    if (newSlideNo > maxSlides) {
        newSlideNo -= maxSlides;
    } else if (newSlideNo < 1) {
        newSlideNo += maxSlides;
    }
    showSlide(newSlideNo);
}

function file_exists(filepath) {
    $.get(filepath)
    .done(function() {
        return true
    })
    .fail(function() {
        return false
    })
}

function show_surveys() {

    console.log("Hello!");

    var username = $('#username-input').val().trim();
    if (username == null || username == '') {
        return false;
    }

    $("#index-select-survey").empty();

    $(`<div>
        <h3>Select your survey!</h3>
        `
    ).appendTo("#index-select-survey");

    var outputHTML = [];

    $.getJSON('static/survey-list.json', function(data) {
        $(data).each(function(index, element) {
            outputHTML.push(
                `<input type="radio" name="survey-select" id="survey-select-${element}" value="${element}">
                <label for="survey-select-${element}">${element}</label>`
            );
        })
        $(outputHTML.join("")).appendTo("#index-select-survey");
    })

    $(`</div>
    <input type="submit" value="Start survey!">
    </form>
    `).appendTo("#index-select-survey");

    return true;
}

$(document).ready(function() {
    formatSlides();
    showSlide(slideNo);
});