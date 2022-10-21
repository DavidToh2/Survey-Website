function filter(HTMLelement, directory) {
    var searchText = $(HTMLelement).val().toLowerCase();
    console.log(searchText);
    $.getJSON(`/static/data/${directory}`, function() {
        console.log("Getting JSON file...")
    })
    .done(function(data) {
        $.each(data, function(key, value) {
            keyLower = key.toLowerCase();
            console.log(key);

            // [text to search through].indexOf([target text])
            // Returns -1 if not found, 0 if target is empty, and start position otherwise
            if (keyLower.indexOf(searchText) == -1) {
                $(`#${key}`).removeClass("dropdown--visible");
            } else {
                $(`#${key}`).addClass("dropdown--visible");
            }
        })
    })
    .fail(function() {
        console.log("Error in getting JSON file");
    })
}

function showSurvey(HTMLelement) {
    var selectedSurvey = $(HTMLelement).attr('id');
    console.log(`${selectedSurvey}`);
}

