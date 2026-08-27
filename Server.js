const express = require('express');
const db= require('./db');
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.post("/v1/tasks", async (req, res) => {
  const { title, completed } = req.body;

  const [result] = await db.query(
    "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    [title, completed ?? false],
  );

  res
    .status(201)
    .json({ id: result.insertId, title, completed: completed ?? false });
});

app.get("/tasks", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM tasks");
  res.json(rows);
});

app.get("/tasks/:id", async (req, res) => {

    const { rows } = await db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
    if (rows.length===0) {
        return res.status(404).json({"message": "No tasks found"});
    }
    res.json(rows[0]);

});

app.patch("/tasks/:id", (req, res) => {
  res.json({ message: `update task ${req.params.id}` });
});

app.delete("/tasks/:id", (req, res) => {
  res.json({ message: `delete task ${req.params.id}` });
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
