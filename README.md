# WorkAsana – Frontend

A team task and project management dashboard. Sign up or log in, create projects and teams, assign and track tasks through their workflow, and view reports with charts. Built with React, React Router, Bootstrap, and Chart.js, backed by a REST API with JWT authentication.

## Live Demo

[Live Demo](https://work-asana-frontend-six.vercel.app/)

## Quick Start

```bash
git clone https://github.com/tanaymurade74/WorkAsanaFrontend.git
cd WorkAsanaFrontend
npm install
```

Create a `.env` file in the project root, pointing at the backend:

```env
REACT_APP_API_URL=http://localhost:3001
```

> Replace with your deployed [backend](https://github.com/tanaymurade74/WorkAsanaBackend) URL in production.

Then start the app:

```bash
npm start
```

## Technologies

* React JS
* React Router
* Bootstrap
* Chart.js (react-chartjs-2)
* Create React App

## Features

**Authentication**

* User signup and login with JWT
* Token stored in the browser and sent with every request
* Protected pages for projects, teams, tasks, and reports

**Home / Dashboard**

* Overview of your projects and the tasks assigned to you
* Create a new project or task directly from the dashboard

**Projects**

* View a project's details and all tasks within it
* Add new tasks to a project

**Teams**

* List all teams and create new ones
* View a team's details and its members

**Tasks**

* View task details and update status (To Do, In Progress, Completed, Blocked)
* Tasks carry owners, tags, and an estimated time to complete

**Reports**

* Charts for tasks completed last week, pending work, and tasks closed by team, project, and owner

**Settings**

* Manage and delete existing projects, teams, and tasks

## API Reference

This app consumes the WorkAsana backend REST API. The base URL is read from `REACT_APP_API_URL`, and a JWT token is sent in the `Authorization` header on every request.

### POST /auth/signup
Register a new user. Sample Response: `{ message, User: { id, name, email } }`

### POST /auth/login
Log in and receive a token. Sample Response: `{ message, token, User }`

### GET /projects · GET /teams · GET /tasks
Fetch projects, teams, and tasks for the dashboard and detail views.

### POST /projects · POST /teams · POST /tasks
Create a project, team, or task.

### GET /report/lastWeek · GET /report/pending · GET /report/closedTasks
Data behind the reports charts.

> Full endpoint list: see the [backend repository](https://github.com/tanaymurade74/WorkAsanaBackend).
