function buildQuiz() {

    $("#survey").empty();

    var questionFile = $("input[name='selectedSurvey']").val();
    console.log(questionFile);

    $.getJSON(`static/surveys/${questionFile}.json`, function(data) {

        var noOfSections = data[0].sections;

        $(`<input type="hidden" name="noOfSections" value="${noOfSections}">`).appendTo("#survey");

        /* Iterates over each section */

        for (let i = 1; i <= noOfSections; i++) {
            var sectionName = data[i][0]["section-name"];
            var noOfQuestions = data[i][0]["questions"];
            data[i].shift();

            $(`<div class="survey-section" id="section-${i}">
                <input type="hidden" name="s${i}_noOfQuestions" value="${noOfQuestions}">
                <div class="survey-section-title">
                    ${sectionName}
                </div>
                <div class="survey-questions" id="section-${i}-questions"></div>`).appendTo("#survey");

                /* Iterates over each question */

            $(data[i]).each(function(index, question) {
                var questionNo = index + 1;
                var outputHTML = [];

                    // Question statement

                outputHTML.push(
                    `<div class="survey-question">
                        <div class="survey-question-no">Q${questionNo}.</div>
                        <div class="survey-question-text">
                            ${question["question"]}
                        </div>`);

                    // Question input

                switch(question["input-type"]) {
                    case "text":
                        outputHTML.push(
                            `<div class="survey-question-answer">
                                <input type="text" class="survey-input-short" name="s${i}_q${questionNo}_input" id="s${i}-q${questionNo}-input" placeholder="Answer here">
                            </div>`);
                        break;
                    case "textarea":
                        outputHTML.push(`<div class="survey-question-answer">
                                <textarea class="survey-input-textArea" name="s${i}_q${questionNo}_input" id="s${i}-q${questionNo}-input" placeholder="Answer here"></textarea>
                            </div>`);
                        break;
                    case "options":
                        let noOfOptions = question["options"].length;
                        for (let j=1; j<=noOfOptions; j++) {
                            console.log(question["options"][j-1])
                            outputHTML.push(
                                `<div class="survey-question-answer">
                                <input type="radio" name="s${i}_q${questionNo}_input" id="s${i}-q${questionNo}-option-${j}" value="${j}"><label for="s${i}-q${questionNo}-option-${j}">${j}. ${question["options"][j-1]}</label>
                                </div>`
                        )}
                        break;
                }

                    // Answer

                if (question["input-type"] == "options") {
                    outputHTML.push(`<div class="survey-question-response" id="q${questionNo}-response">The correct answer is ${question["correct-answer"]}
                            </div>
                        `);
                }

                outputHTML.push("</div>");

                $(outputHTML.join("")).appendTo(`#section-${i}-questions`);
            
            $(`</div> </div>`).appendTo("#survey");
            })

        }
    })
}

$(document).ready(function() {

    /* https://stackoverflow.com/questions/12070631/how-to-use-json-file-in-html-code */

    console.log("Building quiz page...")
    buildQuiz();
    console.log("Page build complete!")

});