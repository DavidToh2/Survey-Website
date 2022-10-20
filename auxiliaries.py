import sqlite3
import pandas as pd
import json
import os

            # Returns an array containing noOfSections and noOfQuestions(per section) info.
            # Information is read from the .json file.

def getNoOfQuestions(selectedSurvey):    
    
    survey = getJSON(f"static/surveys/{selectedSurvey}.json")

    output = []
    for i in range(0, len(survey)):
        output.append(len(survey[i]['questions']))

    return output   
        # [ # QNS (S1), # QNS (S2), # QNS (S3), etc. ]
        # Use len() to obtain the number of sections.



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



def printDatabase():
    print('\n')
    db = sqlite3.connect('results.db')
    for line in db.iterdump():
        print(line)
    print('\n')


                # Create survey entry in table

def setTable(selectedSurvey, operation):
            
    db = sqlite3.connect('results.db')

    match(operation):

        case 'create':

            tables = db.execute(f"SELECT name FROM sqlite_master WHERE type = 'table'")

                # If the table already exists, return True

            for row in tables:
                if row[0] == selectedSurvey:
                    db.close()
                    return True
            
            executeString = [f"CREATE TABLE {selectedSurvey} (id INTEGER, name TEXT, "]

                # Read survey info from the json file

            qnNoArray = getNoOfQuestions(selectedSurvey)
            noOfSections = len(qnNoArray)
            for i in range(0, noOfSections):
                noOfQuestions = qnNoArray[i]
                for j in range(0, noOfQuestions):
                    # All three question types use the same data storage (TEXT), so it's okay
                    executeString.append(f"s{i+1}_q{j+1}_answer TEXT, ")

            executeString.append("PRIMARY KEY(id));")
            executeStr = "".join(executeString)

            db.execute(executeStr)
            db.commit()
            db.close()

                # Updates survey-list.json, which functions similarly to a "package directory"

            doSurveyList('a', selectedSurvey)

            return False

        case 'delete':

            db.execute(f"DROP TABLE {selectedSurvey};")
            db.commit()
            db.close()

        case 'clear':

            db.execute(f"DELETE FROM {selectedSurvey};")
            db.commit()
            db.close()



    # ASSISTANT FUNCTIONS

def getDir(path):

    basedir = os.path.abspath(os.path.dirname(__file__))
    return os.path.join(basedir, path)

def getJSON(path):
    return json.load(open(getDir(path), "r"))