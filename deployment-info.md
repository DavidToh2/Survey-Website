## Version control using Git


`git commit` is used to **commit** (i.e. save) changes from the **workspace** to the **local repository**.

To commit all changes, type
> `$ git commit -a -m "Commit message here" `

To commit changes to specific files, type
> `$ git add file1 file2 ...`
>
> `$ git commit -m "Commit message here" `

`git push` is used to **update remote repositories** linked to the local repository. Remote repositories are linked to the local repository using **remotes**.

To list all remote repositories, type

> `$ git remote`
>
> `survey-website` - The remote to the GitHub repository you're looking at right now
>
> `heroku` - The remote to the production Heroku app.
>
> `heroku-staging` - The remote to the staging Heroku app.

To upload changes to GitHub, type
> `$ git push survey-website master`

<hr>

### Environment Set-up

To set-up the Git repository, type
> `$ git init`
>
> `$ git remote add [remote-name] [GitHub URL]`

To set-up a Python virtual environment called "venv", type
> `$ python -m venv venv`

This environment can be activated and deactivated respectively using
> `$ source venv/bin/activate`
>
> `(venv) $ deactivate`

To update the project's dependency list, type
> `$ pip freeze > requirements.txt`

To configure the list of files ignored by git, type
> `$ echo "venv" > .gitignore`

<hr>

## Deployed in Heroku

Heroku **pipelines** allow for the implementation of **continuous delivery/integration (CD/CI) workflow**. Apps may be at any of the following stages:
- development/review
- staging. This is the preproduction environment where testing and previewing takes place.
- production. This is the live site accessed by final users.

This app is built in a pipeline, named `survey-website-pipeline`. There are two components to this pipeline:
- the app `survey-website-flask-staging`, used for staging;
- the app `survey-website-flask`, used for production.

Changes are first **tested in the local development server**, using
> `$ flask --debug run`

Changes are next **pushed to the staging app,** using
> `$ git push heroku-staging master`

The staging app may be accessed at https://survey-website-flask-staging.herokuapp.com/.

Changes are finally **pushed to the production app**, using
> `$ heroku pipelines:promote --remote heroku-staging`

(Actually, this just copies over the code from the staging app to the production app.)

Note that, for projects with multiple production apps, it's useful to specify exactly which apps you want to promote to:
> `$ heroku pipelines:promote --remote heroku-staging --to survey-website-flask`

<hr>

### Heroku Set-up

This app uses **Heroku v7.63.4** on x64 Linux.

To create an app, use
> `$ heroku create [app-name] --remote [remote-name]`

This also adds the named git remote.

To create a pipeline with a pre-existing app, use
> `$ heroku pipelines:create [pipeline-name] --app [app-name] --stage [stage-name]`

To add a pre-existing app into a pipeline, use
> `$ heroku pipelines:add [pipeline-name] --app [app-name] --stage [stage-name]`

To specify the Python Runtime Environment, type in the project's root folder
> `$ echo "python-3.10.6" > runtime.txt`

The following code sets up the project's **Procfile**, which tells Heroku how to run the app. We use **Gunicorn**, a Python Web Server Gateway Interface (WSGI) HTTP server. Note that there has to be a space after "web:".
> `$ echo "web: gunicorn app:app" > Procfile`