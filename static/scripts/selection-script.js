var currentSurveyIndex = 1;
var noOfSurveys;

function initialiseSurveySelection() {
    if (noOfSurveys == 1) {
        displaySurveys([1]);
    } else if (noOfSurveys == 2) {
        displaySurveys([1, 2]);
    } else {
        displaySurveys([1, 2, noOfSurveys]);
    }
}

function incrementSurvey(n) {
    currentSurveyIndex += n;
    let a = modulo(currentSurveyIndex, noOfSurveys);
    let b = modulo(currentSurveyIndex + 1, noOfSurveys);
    let c = modulo(currentSurveyIndex - 1, noOfSurveys);
    displaySurveys([a, b, c]);
}

function displaySurveys(arr) {
    var cards = $("#surveys-container").children(".card");
    cards.each(function(index, element) {
        $(this).removeClass("card--left card--middle card--right");
    })
    console.log(arr);
    console.log(noOfSurveys);
    $(cards[arr[0] - 1]).addClass("card--middle");
    if (noOfSurveys > 1) {
        $(cards[arr[1] - 1]).addClass("card--right");
        if (noOfSurveys > 2) {
            $(cards[arr[2] - 1]).addClass("card--left");
        }
    }
}

function modulo(a, n) {
    while (a > n) {
        a -= n;
    }
    while (a < 1) {
        a += n;
    }
    return a;       /* Returns a value between 1 and n */
}

$(document).ready(function() {

    noOfSurveys = $("#noOfSurveys").html();
    initialiseSurveySelection();
    console.log("Survey selection page build complete!");

})