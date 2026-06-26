
async function initSqlJs() {
  const SQL = await initSqlJs({
    // locateFile returns the URL for the requested wasm file
    locateFile: (filename) => `https://cdn.jsdelivr.net/npm/sql.js@1.14.0/dist/${filename}`,
  });

  // Create an empty in-memory database
  const db = new SQL.Database();
  return db;
}

const db = await initSqlJs();
// Use run() for DDL statements
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL,
    age  INTEGER
  )
`);
// Don't concatenate strings — SQL injection risk
// db.run(`INSERT INTO users (name, age) VALUES ('Alice', 30)`);

// Use parameter binding instead
db.run('INSERT INTO users (name, age) VALUES (?, ?)', ['Alice', 30]);
db.run('INSERT INTO users (name, age) VALUES (?, ?)', ['Bob', 25]);
db.run('INSERT INTO users (name, age) VALUES (?, ?)', ['Carol', 28]);
// exec() returns [{ columns: [...], values: [[...], [...]] }]
const results = db.exec('SELECT id, name, age FROM users WHERE age > ?', [26]);

if (results.length > 0) {
  const { columns, values } = results[0];

  // columns: ['id', 'name', 'age']
  // values:  [[1, 'Alice', 30], [3, 'Carol', 28]]

  // Convert to array of objects for easier use
  const rows = values.map((row) =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );

  console.log(rows);
  // [{ id: 1, name: 'Alice', age: 30 }, { id: 3, name: 'Carol', age: 28 }]
}
// UPDATE
db.run('UPDATE users SET age = ? WHERE name = ?', [31, 'Alice']);

// DELETE
db.run('DELETE FROM users WHERE age < ?', [27]);
db.run('DELETE FROM users WHERE age < ?', [27]);

// getRowsModified() returns the row count from the last operation
const affected = db.getRowsModified();
console.log(`Deleted ${affected} row(s)`);
// Create a prepared statement
const stmt = db.prepare('INSERT INTO users (name, age) VALUES (?, ?)');

const users = [
  ['Dave', 22],
  ['Eve', 35],
  ['Frank', 29],
];

// Batch insert
for (const [name, age] of users) {
  stmt.run([name, age]);
}

// Always free statements when done — otherwise you get memory leaks
stmt.free();
const stmt = db.prepare('SELECT * FROM users WHERE name = :name AND age > :minAge');

stmt.bind({ ':name': 'Alice', ':minAge': 25 });

// step() advances one row at a time, returns true while rows remain
while (stmt.step()) {
  const row = stmt.getAsObject();
  // row is { id: 1, name: 'Alice', age: 30 }
  console.log(row);
}

stmt.free();
// Create a custom function (SQLite has built-in length, this is just an example)
db.create_function('js_upper', (str) => str.toUpperCase());

// Use it directly in SQL
const results = db.exec("SELECT js_upper(name) AS upper_name FROM users");
// Returns [{ columns: ['upper_name'], values: [['ALICE'], ['BOB'], ...] }]
// SQLite doesn't support REGEXP out of the box — add it yourself
db.create_function('regexp', (pattern, str) => {
  return new RegExp(pattern).test(str) ? 1 : 0;
});

// Now REGEXP works in queries
const results = db.exec("SELECT * FROM users WHERE regexp('^A', name)");
// export() returns a Uint8Array — the raw binary content of the .db file
const data = db.export();

// Prompt the user to download the file
const blob = new Blob([data], { type: 'application/octet-stream' });
const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = 'mydb.sqlite';
a.click();

// Clean up
URL.revokeObjectURL(url);
// Read a .db file from an <input type="file"> element
async function loadDatabase(file) {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);

  // Pass the binary data to the Database constructor
  const db = new SQL.Database(data);
  return db;
}

// Or fetch from a server
async function fetchDatabase(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const db = new SQL.Database(new Uint8Array(buffer));
  return db;
}
// main.js
// Use the official sql.js Worker script
const worker = new Worker(
  'https://cdn.jsdelivr.net/npm/sql.js@1.14.0/dist/worker.sql-wasm.js'
);

// All operations go through message passing
worker.onmessage = (event) => {
  const { id, results, error } = event.data;
  if (error) {
    console.error('SQL error:', error);
    return;
  }
  console.log('Query results:', results);
};

// Initialize the database
worker.postMessage({ id: 1, action: 'open' });

// Execute SQL
worker.postMessage({
  id: 2,
  action: 'exec',
  sql: 'CREATE TABLE test (id INTEGER, val TEXT)',
});

worker.postMessage({
  id: 3,
  action: 'exec',
  sql: 'INSERT INTO test VALUES (?, ?)',
  params: [1, 'hello'],
});

worker.postMessage({
  id: 4,
  action: 'exec',
  sql: 'SELECT * FROM test',
});