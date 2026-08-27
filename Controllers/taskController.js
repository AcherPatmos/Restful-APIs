const taskModel = require("../models/taskModel");

async function getAllTasks(req, res, next) {
  try {
    const tasks = await taskModel.findAll();
    res.json(tasks.map(t => ({ ...t, completed: Boolean(t.completed) })));
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTasks };