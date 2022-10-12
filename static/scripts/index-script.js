
let maxSlides = 3, slideNo = 1;
let maxCards = 5, cardNo = 2;

function showCards(n) {

    let a = modulo(n-1, maxCards), b = n, c = modulo(n+1, maxCards);

    var cardContainer = $("#card-container").eq(0);
    cardContainer.empty();

    $.getJSON("static/data/cards.json", function(data) {

        var outputHTML = [];

        $.each([a,b,c], function(index, element) {
            let filepath = data[element - 1].filepath;
            let t1 = data[element - 1]["testimony-1"];
            let t2 = data[element - 1]["testimony-2"];
            let t3 = data[element - 1]["testimony-3"];
            switch(index) {
                case 0:
                    outputHTML.push(`<div class="card card--left">`)
                break;
                case 1:
                    outputHTML.push(`<div class="card card--middle">`)
                break;
                case 2:
                    outputHTML.push(`<div class="card card--right">`)
                break;
            }
            outputHTML.push(
            `
                <img class="card__img" src="static/${filepath}">
                <div class="card__desc">
                    <ul class="card__list">
                        <li>${t1}</li>
                        <li>${t2}</li>
                        <li>${t3}</li>
                    </ul>
                </div>
            </div>`
            );
        })

        outputHTML.push(`
        <button class="card__prev" onclick="incrementCard(-1)">&#10094;</button>
        <button class="card__next" onclick="incrementCard(1)">&#10095;</button>`)

        $(outputHTML.join("")).appendTo(cardContainer);

    })

    return true;
}

function incrementCard(n) {
    cardNo = modulo(cardNo + n, maxCards)
    showCards(cardNo);
}

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

function modulo(a, n) {
    while (a > n) {
        a -= n;
    }
    while (a < 1) {
        a += n;
    }
    return a;       /* Returns a value between 1 and n */
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

            /* Deprecated: Show surveys */

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

    $.getJSON('static/data/survey-list.json', function(data) {
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
    showCards(cardNo);
});