from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import database

app = Flask(__name__)

    # FLASK DOES NOT SUPPORT PHP

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

                    # This function uses Python to directly read noOfSections and noOfQuestions data from the survey.json file.
                    # The function is defined in database.py.

    selectedSurvey = request.form.get("survey-select")

    if selectedSurvey:      # User clicks on a specific survey

        db = sqlite3.connect("results.db")
        responseData = db.execute(f"SELECT * from {selectedSurvey}").fetchall()
        surveyInfo = database.parseSurveyInfo(selectedSurvey)
        return render_template("results.html", selectedSurvey = selectedSurvey, responses = responseData, surveyInfo = surveyInfo)

    else:                   # User first loads in the results page. Select survey prompt

        surveyList = database.doSurveyList('l')
        return render_template("results.html", surveyList = surveyList)
