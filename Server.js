const express = require('express');
const db= require('./db');
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})


app.post("/v1/tasks", async (req, res) => {

    const { title, completed } = req.body;

    const [result] = await db.query("INSERT INTO tasks (title, completed) VALUES (?, ?)", [title, completed ?? false]);

    res.status(201).json({ id: result.insertId, title, completed: completed ?? false });

});

app.get("/v1/tasks", async (req, res) => {

        const [rows] = await db.query("SELECT * FROM tasks");

        if (rows.length === 0) {
            return res.status(404).json({"message": "No tasks found."});
        }
        res.json(rows);

});

app.get("/v1/tasks/:id", async (req, res) => {

    const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
    if (rows.length===0) {
        return res.status(404).json({"message": "No tasks found with id " + req.params.id});
    }
    res.json(rows[0]);

});

app.patch("/v1/tasks/:id", async (req, res) => {
  const { title, completed } = req.body;

  const fields = [];
  const values = [];

  if (title !== undefined) {
    fields.push("title = ?");
    values.push(title);
  }

  if (completed !== undefined) {
    fields.push("completed = ?");
    values.push(completed);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  values.push(req.params.id);

  const [result] = await db.query(
    `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json({ message: "Task with id" + req.params.id+ "updated" });
});

app.delete("/v1/tasks/:id", async (req, res) => {

    const [result]= await db.query("DELETE FROM tasks where id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
        return res.status(404).json({"message": "No tasks found with id " + req.params.id});
    }
    res.status(204).send();
});

