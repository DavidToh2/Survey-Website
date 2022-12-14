# Random survey website

## Front-end
- **Jinja2** macros used to render templates
- **SASS** used as a CSS pre-processor
- **JQuery** used to build HTML pages, as well as manipulate a few design elements of the page

## The survey
- Information stored in **JSON** files
- Surveys indexed in `/data/survey-list.json`, containing internal and display names as well as their short (i.e. card) and long (i.e. survey page) descriptions
  - Data structure:
```
{
    <internal name>: {
        "image-name": Image to be used on card,
        "survey-title": Display name,
        "short-description": Description on card,
        "long-description": Description on survey page
    }
}
```
- Information for individual survey stored in `/surveys/<internal name>.json`.
  - Data structure:
```
[
    {
        "section-no": Section number,
        "section-name": Display section name,
        "section-desc": Display section description,
        "questions": [
            {
                "question": Question,
                "input-type": text | textarea | options,

                --- for text and textarea questions ---
                "regex": <Regular expression for input parsing>,

                --- for option questions ---
                "options": [option1, option2, ...],

                --- for questions with correct answers ---
                "correct-answer": Correct option OR text answer
                (Text answers are UPPERCASE()-d before validation)
            }
        ]
    }
]
```

## Database
- **SQL database** managed using the Python SQLite3 Extension. Sample schema below.
  - `s[a]_q[b]_answer` refers to the answer to section $a$, question $b$. All three types of answers are stored in `TEXT` form.
```
CREATE TABLE <internal survey name> (
    id INTEGER, name TEXT,
    s1_q1_answer TEXT, s1_q2_answer TEXT, s1_q3_answer TEXT,
    PRIMARY KEY(id)
);
```
- Additional administrative database manipulation can be accomplished using the functions exposed in `auxiliaries.py`

| Function | Description |
| --- | --- |
| `printDatabase()` | Prints out the entire database schema in the console |
| `getSurvey(survey)` | Returns the target survey's entire JSON file, i.e. the survey information |
| `getNoOfQuestions(survey)` | Fetches survey information with `getSurvey()`, then parses it to return an array in the format <br />` [ No. of qns in Section 1, No. of qns in Section 2, ... ]  ` |
| `setTable(survey, 'create'\|'delete'\|'clear')` | `create`: Creates a table for the new survey, based on information from `getNoOfQuestions(survey)` <br /> `delete`: Deletes the entire table <br /> `clear`: Clears the entire table |
| `doSurveyList('a'\|'r'\|'l', survey)` | Add, remove or list all surveys in `survey-list.json` |

## Server
- **Flask**, a Python framework
- Survey response data is parsed and marked by Python

## Deployment: Heroku

- Website at [this link](https://survey-website-flask.herokuapp.com/)...at least until November 27, 2022
- Staging app at [this link](https://survey-website-flask-staging.herokuapp.com/). The website is no longer in development, so both are now identical

## Data flow: Survey submission

**The survey form is rendered** using JINJA2 macros:
```
{% macro text|textArea|radioOption( sectionIndex, questionIndex, placeholder|optionArray ) %}
    <text/textarea name="s[a]-q[b]">
    <input type="radio" name="s[a]-q[b]" value=Option Number>
{% endmacro %}
```

**HTML form inputs** are **passed by POST** upon form submission to `app.py`. (The survey internal and display names are stored in hidden inputs.)

**Survey information** is obtained using the auxiliary functions
```
doSurveyList("l", selectedSurvey)   # Checks that selectedSurvey exists -
                                    # otherwise potential avenue for XSS
getSurvey(selectedSurvey)
```

**Survey responses are parsed** in the following format:
```
results = [
   [ (Each section is an array of questions)
       {
           'status': 0 for open-ended, 1 for correct, -1 for wrong,
           'response': user answer,
           'correct': correct answer, if it exists
       }
   ]
]
```

Survey responses are then **added to the database**:
```
db.execute("SELECT max(id) from {selectedSurvey} WHERE name = ?", [username]).fetchone()[0]
db.execute("UPDATE {selectedSurvey} SET s{i+1}_q{j+1}_answer = ? WHERE id = ?", (Answers[i][j]['response'], targetID))
```

Finally, survey information (i.e. questions) and responses are passed to the the **thank-you page** to be rendered by JINJA2 macros.
- Recall that `result = {'status': 0|1|-1, 'response', 'correct'}`
```
{% macro [text|textArea]Marked( sectionIndex, questionIndex, result ) %}
{% macro [radioOption]Marked( sectionIndex, questionIndex, options, result ) %}
    {% if status == 0 %}
        <!-- Question is open-ended, display user response -->
    {% else %}
        <!-- Question has a correct answer, display correct and wrong answers -->
    {% endif %}
{% endmacro %}
```

## Data flow: Fetching results

To **select a survey**, `doSurveyList('l')` is called to return a list of surveys, used to build a drop-down menu.

A **search function** implemented in `scripts/results-script.js` implements
```
function filter(HTMLElement, search directory) {
    if HTMLElement.value not in search directory:
        Set corresponding drop-down item to be invisible
}
```
which is called `onKeyUp()` of the search input.

On **selecting a survey**, a **POST request** is sent via Javascript to `app.py` that returns all survey data, as well as survey information.
```
db.execute(f"SELECT * from {selectedSurvey}").fetchall()
```

The Javascript then **builds the result table**, using the survey information to populate the hoverable header and question tooltips.

## Areas for Improvement:

- Python auxiliaries should be more structured
  - Survey data-parsing and marking should be implemented in a separate Python module to avoid clogging up `app.py`
- Use a proper Javascript framework for updating HTML
- Split `styles.scss` into multiple files, then compile using `SASS`, instead of using one giant file
- Survey information can potentially be stored in a database instead?

Features that can be added:
- Nicer-looking pages and CSS formatting in general
- Contribute and modify surveys
- Login system
- (Admin) Modify or clear the database from the website directly