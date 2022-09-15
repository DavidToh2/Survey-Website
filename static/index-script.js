

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
