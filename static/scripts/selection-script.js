var currentSurveyIndex = 1;

function initialiseSurveySelection() {

    $.getJSON("static/data/survey-list.json", function(data) {
        let noOfSurveys = data.length;
        sessionStorage.setItem("noOfSurveys", noOfSurveys);
        loadSurveySelection(1, noOfSurveys);
    })

}

function incrementSurvey(n) {
    let noOfSurveys = sessionStorage.getItem("noOfSurveys");
    currentSurveyIndex = modulo(currentSurveyIndex + n, noOfSurveys);
    loadSurveySelection(currentSurveyIndex, noOfSurveys);
}

function loadSurveySelection(a, noOfSurveys) {

    var surveyContainer = $("#surveys-container");
    surveyContainer.empty();

    $.getJSON("static/data/survey-list.json", function(data) {
        var outputHTML = [];
        var arr1 = [a];

        if (noOfSurveys > 1) {
            arr1.push(modulo(a+1, noOfSurveys));
            if (noOfSurveys > 2) {
                arr1.push(modulo(a-1, noOfSurveys));
            }
        }

        console.log(arr1);

        $.each(arr1, function(index, element) {
            let e = element - 1;
            switch(index) {
                case 0:
                    var cardLocation = "middle"; break;
                case 1:
                    var cardLocation = "right"; break;
                case 2:
                    var cardLocation = "left"; break;
            }
            console.log(data[e]);
            outputHTML.push(
                `<div class="card card--${cardLocation}">
                    <img class="card__img" src="/static/images/survey-icon/${data[e]["image-name"]}">
                    <a href="{{ url_for('loadSurvey', selectedSurvey = ${data[e]["survey-name"]}) }}">
                        <div class="card__desc">
                            <p class="survey-title">${data[e]["survey-title"]}</p>
                            <p class="survey-description">${data[e]["survey-description"]}</p>
                        </div>
                    </a>
                </div>`
            )
            
        })

        outputHTML.push(`
        <button class="card__prev" onclick="incrementSurvey(-1)">&#10094;</button>
        <button class="card__next" onclick="incrementSurvey(1)">&#10095;</button>`
        )

        $(outputHTML.join("")).appendTo(surveyContainer);

    })
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

    initialiseSurveySelection();
    console.log("Survey selection page build complete!");

})