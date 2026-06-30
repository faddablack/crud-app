import { useEffect, useState } from "react";
import "./styles.css";
import TodoItem from "./TodoItem";
import EditForm from "./EditForm";
import Alert from "./components/Alert";
import {
  getAllTodos,
  addTodo,
  updateTodoText,
  toggleTodoDone,
  deleteTodo,
} from "./api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [todo, setTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});
  const [msg, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  useEffect(() => {
    async function init() {
      try {
        const data = await getAllTodos();
        setTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  function handleInputChange(e) {
    setTodo(e.target.value);
  }

  function handleEditInputChange(e) {
    setCurrentTodo({ ...currentTodo, text: e.target.value });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (todo.trim() !== "") {
      try {
        const updated = await addTodo(todo.trim());
        setTodos(updated);
      } catch (err) {
        setError(err.message);
      }
    }
    setTodo("");
  }

  async function handleEditFormSubmit(e) {
    e.preventDefault();
    try {
      const updated = await updateTodoText(currentTodo.id, currentTodo.text);
      setTodos(updated);
    } catch (err) {
      setError(err.message);
    }
    setIsEditing(false);
  }

  function handleDeleteClick(id, todo) {
    setOpen(true);
    setMessage(todo.text);
    setId(id);
  }

  async function handleToggleDone(todoId) {
    const target = todos.find((t) => t.id === todoId);
    try {
      const updated = await toggleTodoDone(todoId, target.done);
      setTodos(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEditClick(todo) {
    setIsEditing(true);
    setCurrentTodo({ ...todo });
  }

  async function taskDelete(id) {
    try {
      const updated = await deleteTodo(id);
      setTodos(updated);
    } catch (err) {
      setError(err.message);
    }
    setOpen(false);
  }

  if (loading) {
    return <div className="App">Loading…</div>;
  }

  if (error) {
    return (
      <div className="App">
        Couldn't reach the server: {error}. Make sure the backend is running
        on http://localhost:3001.
      </div>
    );
  }

  return (
    <div className="App">
      {isEditing ? (
        <EditForm
          currentTodo={currentTodo}
          setIsEditing={setIsEditing}
          onEditInputChange={handleEditInputChange}
          onEditFormSubmit={handleEditFormSubmit}
        />
      ) : (
        <form onSubmit={handleFormSubmit}>
          <h2>Add Todo</h2>
          <label htmlFor="todo">Add todo: </label>
          <input
            name="todo"
            type="text"
            placeholder="Create a new todo"
            value={todo}
            onChange={handleInputChange}
          />
          <button type="submit">Add</button>
        </form>
      )}

      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onEditClick={handleEditClick}
            onDeleteClick={(id) => handleDeleteClick(id, todo)}
            onToggleDone={handleToggleDone}
          />
        ))}
      </ul>

      <Alert
        isOpen={open}
        isDelete={() => taskDelete(id)}
        message={msg}
        isClose={() => setOpen(false)}
      />
    </div>
  );
}
