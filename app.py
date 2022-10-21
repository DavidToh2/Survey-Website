from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import auxiliaries
import json

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

    cards = auxiliaries.getJSON("static/data/cards.json")
    return render_template("index.html", cards = cards)

@app.route("/survey")
def selectSurvey():

    surveyList = auxiliaries.getJSON("static/data/survey-list.json")
    return render_template("selection.html", surveyList = surveyList)

@app.route("/survey/<selectedSurvey>", methods=["GET"])
def loadSurvey(selectedSurvey):

    if selectedSurvey == None:
        return redirect(url_for('index'))
    surveyQns = auxiliaries.getJSON(f"static/surveys/{selectedSurvey}.json")
    surveyList = auxiliaries.doSurveyList('l')
    surveyName = surveyList[selectedSurvey]['survey-title']
    surveyDesc = surveyList[selectedSurvey]['long-description']
    return render_template("survey.html", selectedSurvey = selectedSurvey, surveyQns = surveyQns, surveyName = surveyName, surveyDesc = surveyDesc)


@app.route("/thank-you", methods=["POST"])
def submitSurvey():

    username = request.form.get("username")
    if (not username):
        return False
    selectedSurvey = request.form.get("selectedSurvey")
    selectedSurveyName = request.form.get("surveyName")
    
    surveyQns = auxiliaries.getJSON(f"static/surveys/{selectedSurvey}.json")

    noOfSections = len(surveyQns)
    noOfQuestions = []
    Answers = []
    correctedAnswers = []

    for i in range(0, noOfSections):

        questionArray = surveyQns[i]['questions']
        noOfQuestions.append(len(questionArray))

        sectionAnswers = []

        for j in range(0, noOfQuestions[i]):

            a = request.form.get(f"s{i+1}-q{j+1}")
            if a == None:
                return render_template("error.html")

                    # Checks if answer is correct

            if 'correct-answer' in questionArray[j]:            
                c = questionArray[j]['correct-answer']
                if isinstance(c, str):
                    c = c.upper().strip() 
                    a = a.upper().strip()
                    if c == a:
                        status = 1
                    else:
                        status = -1
                elif isinstance(c, int):
                    a = int(a)
                    if c == int(a):
                        status = 1
                    else:
                        status = -1
                sectionAnswers.append({'status': status, 'response': a, 'correct': c})
            else:
                status = 0
                sectionAnswers.append({'status': status, 'response': a})

            
        Answers.append(sectionAnswers)

    # print(username)
    # print(Answers)

                # Uploads the answers into the database.
        
    # Checks if SQL table already exists: if not, then creates table
    auxiliaries.setTable(selectedSurvey, 'create')

    db = sqlite3.connect("results.db")

    db.execute(f"INSERT INTO {selectedSurvey} (name) VALUES (?)", [username])
    targetID = db.execute(f"SELECT max(id) from {selectedSurvey} WHERE name = ?", [username]).fetchone()[0]
    for i in range(0, noOfSections):
        for j in range(0, noOfQuestions[i]):
            db.execute(f"UPDATE {selectedSurvey} SET s{i+1}_q{j+1}_answer = ? WHERE id = ?", (Answers[i][j]['response'], targetID))
    db.commit()

                # Displays the results page

    thank_you_message = f"Thank you {username} for participating in this survey! You may review your responses below:"

    return render_template("survey.html", selectedSurvey = selectedSurvey, surveyQns = surveyQns, surveyName = selectedSurveyName, surveyDesc = thank_you_message, results = Answers)


@app.route("/results", methods=["GET", "POST"])
def loadResults():

    selectedSurvey = request.form.get("survey-select")

    if selectedSurvey:      # User clicks on a specific survey

        db = sqlite3.connect("results.db")
        responseData = db.execute(f"SELECT * from {selectedSurvey}").fetchall()     # Fetches all survey data into a 2D array
        return render_template("results.html", selectedSurvey = selectedSurvey, responses = responseData)

    else:                   # User first loads in the results page. Select survey prompt

        surveyList = auxiliaries.doSurveyList('l')
        return render_template("results.html", surveyList = surveyList)
