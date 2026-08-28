const db = require("../db/db");

async function findAll() {
  const [rows] = await db.query("SELECT * FROM tasks");
  return rows;
}

async function findById(id) {
  const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
  return rows[0];
}

async function create(title, completed) {
  const [result] = await db.query(
    "INSERT INTO tasks (title, completed) VALUES (?, ?)",
    [title, completed]
  );
  return result.insertId;
}

async function update(id, fields, values) {
  const [result] = await db.query(
    `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`,
    [...values, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [id]);
  return result.affectedRows;
}

module.exports = { findAll, findById, create, update, remove };