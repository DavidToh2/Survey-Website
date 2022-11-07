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
    var inputBox = $("#selectedSurvey");
    inputBox.val = `${selectedSurvey}`;
        
    var resultDisplay = $("#result");
    $(resultDisplay).empty();

    $.post("/results", {
        "selectedSurvey": `${selectedSurvey}`
    }, function(data) {

        var responseData = data[0];
        var surveyInfo = data[1];
        var surveyQns = data[2];
        var outputHTML = [];

        outputHTML.push(`
        <div class="section">
            <div class="h3" style="margin: 50px 0px; width: 100%;">Results of survey ${selectedSurvey}:</div>
        </div>
        <div id="result-table" style="overflow: visible;">
            <table class="results-table" id="results-table-data">
                <tr class="results-table__header-row">
        `);

            // Formats headers

        outputHTML.push(`
                    <th class="results-table__header">ID</th>
                    <th class="results-table__header">Username</th>
        `);
        for (i=0; i<surveyInfo.length; i++) {
            outputHTML.push(`
                    <th class="results-table__header" colspan="${surveyInfo[i]}">Section ${i+1}</th>
            `);
        }

        outputHTML.push(`
                </tr>
        `);

            // Formats question numbers with hoverable tooltips displaying questions

        console.log("hello");

        
        outputHTML.push(`
            <tr class="results-table__tooltip-row">
                <td></td>
                <td></td>
        `);
        for (i=0; i<surveyInfo.length; i++) {
            for (j=0; j<surveyInfo[i]; j++) {

                var currentQn = surveyQns[i]['questions'][j];

                console.log(currentQn);

                let qnOutput = [
                    `${currentQn['question']}`
                ];
                if (currentQn['input-type'] == "options") {
                    qnOutput.push(
                        `<ul class="tooltip-list">
                            <li>${currentQn['options'][0]}</li>
                            <li>${currentQn['options'][1]}</li>
                            <li>${currentQn['options'][2]}</li>
                            <li>${currentQn['options'][3]}</li>
                        </ul>
                        `
                    )
                }
                outputHTML.push(`
                    <td class="results-table__tooltip">
                        Q${j+1}
                        <div class="tooltip">`)

                outputHTML.push(qnOutput.join(""));
                outputHTML.push(`
                            
                        </div>
                    </td>
                `);
            }
        }
        outputHTML.push(`
            </tr>
        `);

            // Formats question responses

        for (i=0; i<responseData.length; i++) {
            outputHTML.push(`
                <tr class="results-table__data-row">
            `);
            for (j=0; j<responseData[0].length; j++) {
                outputHTML.push(`
                    <td class="results-table__data">${responseData[i][j]}</td>
                `);
            }
            outputHTML.push(`
                </tr>
            `);
        }

        outputHTML.push(`
            </table>
        </div>
        `);

        $(outputHTML.join("")).appendTo(resultDisplay);
    })
}

