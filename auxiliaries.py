import sqlite3
import pandas as pd
import json
import os

def printDatabase():
    db = sqlite3.connect('results.db')
    for line in db.iterdump():
        print(line)

            # Returns an array containing noOfSections and noOfQuestions(per section) info.
            # Information is read from the .json file.

def parseSurveyInfo(selectedSurvey):    
    
    survey = getJSON(f"static/surveys/{selectedSurvey}.json")

    output = []
    output.append(survey[0]["sections"])
    for i in range(1, output[0]+1):
        output.append(survey[i][0]["questions"])

    return output   # [ # SECTIONS, # QNS (S1), # QNS (S2), # QNS (S3), etc. ]

            # Add, remove, or list all surveys

def doSurveyList(option, targetSurvey = None):

    targetDir = getDir("static/data/survey-list.json")
    with open(targetDir, "r") as f:
        surveyList = json.load(f)

    match(option):
        case 'a':       # Add survey to list
            if targetSurvey not in surveyList:
                surveyList.append(targetSurvey)

            with open(targetDir, "w") as f:
                json.dump(surveyList, f)

            return

        case 'r':       # Removes survey from list
            if targetSurvey in surveyList:
                surveyList.remove(targetSurvey)

            with open(targetDir, "w") as f:
                json.dump(surveyList, f)

            return

        case 'l':       # List all surveys
            return surveyList

                # Create survey entry in table

def createTable(selectedSurvey):

    db = sqlite3.connect('results.db')

    tableExists = False
    tables = db.execute(f"SELECT name FROM sqlite_master WHERE type = 'table'")
    for row in tables:
        if row[0] == selectedSurvey:
            tableExists = True
    
    if tableExists == False:

        executeString = [f"CREATE TABLE {selectedSurvey} (id INTEGER, name TEXT, "]

        surveyInfo = parseSurveyInfo(selectedSurvey)

        noOfSections = surveyInfo[0]
        for i in range(1, noOfSections + 1):
            noOfQuestions = surveyInfo[i]
            for j in range(1, noOfQuestions + 1):
                # All three question types use the same data storage (TEXT), so it's okay
                executeString.append(f"s{i}_q{j}_answer TEXT, ")

        executeString.append("PRIMARY KEY(id));")
        executeStr = "".join(executeString)

        db.execute(executeStr)
        db.commit()

            # Updates survey-list.json, which functions similarly to a "package directory"

        doSurveyList('a', selectedSurvey)

        return False

    else:
        return True

def getDir(path):

    basedir = os.path.abspath(os.path.dirname(__file__))
    return os.path.join(basedir, path)

def getJSON(path):
    return json.load(open(getDir(path), "r"))