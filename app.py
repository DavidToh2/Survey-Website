from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import database

app = Flask(__name__)

    # FLASK DOES NOT SUPPORT PHP

    # During development, add option FLASK_DEBUG=True or --debug in the terminal to enable debug mode. (Previously FLASK_ENV=development)
    # This enables an interactive traceback and console display, and more importantly the page refreshes whenever a change is made.

    # This app uses a Python 3.10.6 virtual environment, built using the default venv packge.
    # To activate the virtual environment, type source venv/bin/activate.
    # To deactivate the virtual environment, type deactivate.
    # To output all project dependencies, type pip freeze > requirements.txt.

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/survey", methods=["POST"])
def loadSurvey():

    username = request.form.get("username")
    selectedSurvey = request.form.get("survey-select")
    if selectedSurvey == None:
        return redirect(url_for('index'))
    return render_template("survey.html", userName = username, selectedSurvey = selectedSurvey)


@app.route("/thank-you", methods=["POST"])
def submitSurvey():

                    # This function uses hidden <input name="" value=""> clauses to pass information regarding noOfQuestions
                    # and noOfSections to the server in a POST request.

    username = request.form.get("username")

    selectedSurvey = request.form.get("selectedSurvey")
    noOfSections = int(request.form.get("noOfSections"))            

        # Store answer data in an array of arrays

    answers = []
    noOfQuestions = []
    for i in range(1, noOfSections+1):
        t = int(request.form.get(f"s{i}_noOfQuestions"))
        noOfQuestions.append(t)
        answers_section = []
        for questionNo in range(1, t+1):
            x = request.form.get(f"s{i}_q{questionNo}_input")
            answers_section.append(x)
        answers.append(answers_section)

    print(answers)

        # Checks if SQL table already exists: if not, then creates table

    database.createTable(selectedSurvey)

    db = sqlite3.connect("results.db")

    print(username)
    db.execute(f"INSERT INTO {selectedSurvey} (name) VALUES (?)", [username])
    targetID = db.execute(f"SELECT id from {selectedSurvey} WHERE name = ?", [username]).fetchone()[0]
    for i in range(1, noOfSections + 1):
        for j in range(1, noOfQuestions[i-1] + 1):
            db.execute(f"UPDATE {selectedSurvey} SET s{i}_q{j}_answer = ? WHERE id = ?", (answers[i-1][j-1], targetID))
    db.commit()
    return render_template("thank-you.html", userName = username)

@app.route("/results", methods=["GET", "POST"])
def loadResults():

    selectedSurvey = request.form.get("survey-select")

    if selectedSurvey:      # User clicks on a specific survey

        db = sqlite3.connect("results.db")
        responseData = db.execute(f"SELECT * from {selectedSurvey}").fetchall()     # Fetches all survey data into a 2D array
        surveyInfo = database.parseSurveyInfo(selectedSurvey)                       # Obtain noOfSections and noOfQuestions(per section) info.
        return render_template("results.html", selectedSurvey = selectedSurvey, responses = responseData, surveyInfo = surveyInfo)

    else:                   # User first loads in the results page. Select survey prompt

        surveyList = database.doSurveyList('l')
        return render_template("results.html", surveyList = surveyList)
