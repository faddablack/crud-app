import initSqlJsLib from "sql.js";

const STORAGE_KEY = "todoDb";

let dbInstance = null;

export async function getDb() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJsLib({
    locateFile: (file) => `/${file}`,
  });

  const saved = localStorage.getItem(STORAGE_KEY);

  dbInstance = saved
    ? new SQL.Database(new Uint8Array(JSON.parse(saved)))
    : new SQL.Database();

  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0
    )
  `);

  // Migration: add created_at to existing tables that predate this column
  const columns = rowsToObjects(dbInstance.exec("PRAGMA table_info(todos)"));
  const hasCreatedAt = columns.some((col) => col.name === "created_at");
  if (!hasCreatedAt) {
    dbInstance.run(`ALTER TABLE todos ADD COLUMN created_at TEXT`);
    // Backfill existing rows so old todos still show a timestamp
    dbInstance.run(
      `UPDATE todos SET created_at = ? WHERE created_at IS NULL`,
      [new Date().toISOString()]
    );
    persist(dbInstance);
  }

  // Migration: add updated_at to existing tables that predate this column
  const hasUpdatedAt = columns.some((col) => col.name === "updated_at");
  if (!hasUpdatedAt) {
    dbInstance.run(`ALTER TABLE todos ADD COLUMN updated_at TEXT`);
    // Backfill existing rows so old todos still show a timestamp
    dbInstance.run(
      `UPDATE todos SET updated_at = created_at WHERE updated_at IS NULL`
    );
    persist(dbInstance);
  }

  return dbInstance;
}

export function persist(db) {
  const data = db.export();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(data)));
}

export function rowsToObjects(result) {
  if (!result.length) return [];
  const { columns, values } = result[0];
  return values.map((row) =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

export function getAllTodos(db) {
  const result = db.exec(
    "SELECT id, text, done, created_at, updated_at FROM todos ORDER BY id"
  );
  return rowsToObjects(result).map((t) => ({ ...t, done: !!t.done }));
}

export function addTodo(db, text) {
  const now = new Date().toISOString();
  db.run(
    "INSERT INTO todos (text, done, created_at, updated_at) VALUES (?, ?, ?, ?)",
    [text, 0, now, now]
  );
  persist(db);
  return getAllTodos(db);
}

export function updateTodoText(db, id, text) {
  db.run("UPDATE todos SET text = ?, updated_at = ? WHERE id = ?", [
    text,
    new Date().toISOString(),
    id,
  ]);
  persist(db);
  return getAllTodos(db);
}

export function toggleTodoDone(db, id) {
  db.run(
    "UPDATE todos SET done = NOT done, updated_at = ? WHERE id = ?",
    [new Date().toISOString(), id]
  );
  persist(db);
  return getAllTodos(db);
}

export function deleteTodo(db, id) {
  db.run("DELETE FROM todos WHERE id = ?", [id]);
  persist(db);
  return getAllTodos(db);
}