const taskModel = require("../models/taskModel");

async function getAllTasks(req, res, next) {
  try {
    const tasks = await taskModel.findAll();
    res.json(tasks.map(t => ({ ...t, completed: Boolean(t.completed) })));
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found with id " + req.params.id });
    }
    res.json({ ...task, completed: Boolean(task.completed) });
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, completed } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const id = await taskModel.create(title, completed ?? false);
    res.status(201).json({ id, title, completed: completed ?? false });
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { title, completed } = req.body;
    const fields = [];
    const values = [];

    if (title !== undefined) { fields.push("title = ?"); values.push(title); }
    if (completed !== undefined) { fields.push("completed = ?"); values.push(completed); }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const affected = await taskModel.update(req.params.id, fields, values);
    if (affected === 0) {
      return res.status(404).json({ error: "Task not found with id " + req.params.id });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const affected = await taskModel.remove(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ error: "Task not found with id " + req.params.id });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };