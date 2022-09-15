function displayResults() {

    var resultTableData = $('#results-table-data').html();
    $('#result').empty();

    var selectedSurvey = $('input[name="selectedSurvey"]').val();

    if (selectedSurvey == "None") {
        return;
    } else {

        $.getJSON(`static/surveys/${selectedSurvey}.json`, function(data) {
            
            var outputHTML = [];

            outputHTML.push(`
            <div class="section">
                <h1>Results of survey ${selectedSurvey}:</h1>
            </div>
            <div class="section" id="result-table">
                <table class="results-table">
                    <tr class="results-table-headerrow">
                        <th class="results-table-id results-table-header">ID</th>
                        <th class="results-table-name results-table-header">Name</th>`);

            var noOfSections = data[0].sections;

            for (let i=1; i <= noOfSections; i++) {
                var noOfQuestions = data[i][0]['questions'];
                var sectionName = data[i][0]['section-name'];
                outputHTML.push(`<th class="results-table-header" colspan="${noOfQuestions}">${sectionName}</th>`);
            }

            outputHTML.push(
                `</tr>
                <tr class="results-table-headerrow">
                    <td class="results-table-id"></td>
                    <td class="results-table-name"></td>`
            );

            for (let i=1; i <= noOfSections; i++) {

                data[i].shift();
                $(data[i]).each(function(index, question) {

                    var questionNo = index + 1;
                    switch(question["input-type"]) {
                        case "text":
                        case "options":
                            outputHTML.push(`<td class="results-table-question-short">Q${questionNo}</td>`);
                            break;
                        case "textarea":
                            outputHTML.push(`<td class="results-table-question-long">Q${questionNo}</td>`);
                            break;
                    }

                })

            } 

            console.log(resultTableData);

            outputHTML.push(`</tr>

                    ${resultTableData}
                    
                </table>
            </div>`);

            console.log(outputHTML);
            
            $(outputHTML.join("")).appendTo('#result');

        })

        
    }

}

$(document).ready(function() {

    displayResults();

})