# Task API

A REST API for managing tasks, built with Node.js, Express and MySQL.

Each task has a unique ID, a title, and a boolean indicating whether it has been
completed. Data is accepted and returned as JSON.

## Requirements

- Node.js
- MySQL (this project was developed against the MySQL bundled with XAMPP)

## Setup

**1. Install dependencies**

```
npm install
```

**2. Create the database**

Run the statements in `db/db.sql` against your MySQL server. Using phpMyAdmin,
open the SQL tab and paste the file's contents. Using the MySQL shell:

```
mysql -u root -p < db/db.sql
```

**3. Check the connection settings**

Database credentials live in `db/db.js`. The defaults match a standard XAMPP
install (user `root`, empty password, database `taskdb`). Change them if your
setup differs.

**4. Start the server**

```
npm start
```

The server listens on port 3000 unless a `PORT` environment variable is set.

## Project structure

```
Rest-APIs/
├── Controllers/
│   └── taskController.js    request handling, validation, status codes
├── models/
│   └── taskModel.js         SQL queries
├── routes/
│   └── taskRoutes.js        endpoint definitions
├── db/
│   ├── db.js                MySQL connection pool
│   └── db.sql               database and table creation
├── PostmanTestScreenshots/  screenshots of each endpoint under test
├── app.js                   application entry point
├── package.json
└── .gitignore
```

Responsibilities are kept separate by layer. Routes map URLs to controller
functions and contain no logic. Controllers read the request, decide what the
response should be, and call the models. Models hold every SQL query and know
nothing about HTTP.

## Endpoints

All endpoints are prefixed with `/v1`.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/v1/tasks` | Create a task |
| GET | `/v1/tasks` | List all tasks |
| GET | `/v1/tasks/:id` | Retrieve a single task |
| PUT | `/v1/tasks/:id` | Update a task's title, completion status, or both |
| DELETE | `/v1/tasks/:id` | Delete a task |

### Create a task

`POST /v1/tasks`

```json
{ "title": "buy milk", "completed": false }
```

`completed` is optional and defaults to `false`. Returns `201 Created` with the
new task, including the ID assigned by the database.

### Update a task

`PUT /v1/tasks/:id`

Send only the fields you want to change. Fields left out are not modified.

```json
{ "completed": true }
```

Returns `204 No Content` on success.

## Status codes

| Code | Meaning |
| --- | --- |
| 200 | Data retrieved successfully |
| 201 | Task created |
| 204 | Task updated or deleted; no response body |
| 400 | Request body missing a required field, or no fields to update |
| 404 | No task exists with the given ID |
| 500 | Unexpected server or database error |

## Notes

MySQL has no native boolean type, so `completed` is stored as `0` or `1` in a
`TINYINT` column and converted back to `true` or `false` before being returned
in a response.

All queries use parameterised placeholders rather than string concatenation, so
values from the request can never be interpreted as SQL.

## Testing

The API was tested with Postman. Screenshots of each endpoint, including the
404 cases, are in `PostmanTestScreenshots/`.
