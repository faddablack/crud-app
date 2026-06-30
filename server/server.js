const express = require("express");
const cors = require("cors");
const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// The .db file lives on disk next to this server file.
// This is the single source of truth all browsers will read/write to.
const db = new DatabaseSync(path.join(__dirname, "todos.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

function getAllTodos() {
  const rows = db.prepare("SELECT id, text, done FROM todos ORDER BY id").all();
  return rows.map((r) => ({ ...r, done: !!r.done }));
}

// GET all todos
app.get("/api/todos", (req, res) => {
  res.json(getAllTodos());
});

// CREATE a todo
app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }
  db.prepare("INSERT INTO todos (text, done) VALUES (?, 0)").run(text.trim());
  res.status(201).json(getAllTodos());
});

// UPDATE a todo's text and/or done status
app.patch("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { text, done } = req.body;

  const existing = db.prepare("SELECT * FROM todos WHERE id = ?").get(id);
  if (!existing) {
    return res.status(404).json({ error: "todo not found" });
  }

  const newText = text !== undefined ? text : existing.text;
  const newDone = done !== undefined ? (done ? 1 : 0) : existing.done;

  db.prepare("UPDATE todos SET text = ?, done = ? WHERE id = ?").run(
    newText,
    newDone,
    id
  );
  res.json(getAllTodos());
});

// DELETE a todo
app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  db.prepare("DELETE FROM todos WHERE id = ?").run(id);
  res.json(getAllTodos());
});

app.listen(PORT, () => {
  console.log(`Todo API server running on http://localhost:${PORT}`);
});