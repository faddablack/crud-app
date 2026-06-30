// Base URL of the Express backend. During local dev this is a separate
// port from the React dev server (3000 vs 3001).
const API_URL = "http://localhost:3001/api/todos";

async function handleResponse(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function getAllTodos() {
  const res = await fetch(API_URL);
  return handleResponse(res);
}

export async function addTodo(text) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return handleResponse(res);
}

export async function updateTodoText(id, text) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return handleResponse(res);
}

export async function toggleTodoDone(id, done) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: !done }),
  });
  return handleResponse(res);
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}