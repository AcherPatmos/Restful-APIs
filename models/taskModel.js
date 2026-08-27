const db = require("../db/db");

async function findAll() {
  const [rows] = await db.query("SELECT * FROM tasks");
  return rows;
}

module.exports = { findAll };