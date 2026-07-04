import { useEffect, useState } from "react";
import "./styles.css";
import TodoItem from "./TodoItem";
import EditForm from "./EditForm";
import Alert from "./components/Alert";
import {
  getDb,
  getAllTodos,
  addTodo,
  updateTodoText,
  toggleTodoDone,
  deleteTodo,
} from "./database";
import TodoStats from './components/TodoStats';
import { Button } from "@mui/material";


export default function App() {
  const [db, setDb] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [todo, setTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState({});
  const [msg, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);

  useEffect(() => {
    async function init() {
      const database = await getDb();
      setDb(database);
      setTodos(getAllTodos(database));
      setLoading(false);
    }
    init();
  }, []);

  function handleInputChange(e) {
    setTodo(e.target.value);
  }

  function handleEditInputChange(e) {
    setCurrentTodo({ ...currentTodo, text: e.target.value });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (todo.trim() !== "") {
      setTodos(addTodo(db, todo.trim()));
    }
    setTodo("");
  }

  function handleEditFormSubmit(e) {
    e.preventDefault();
    setTodos(updateTodoText(db, currentTodo.id, currentTodo.text));
    setIsEditing(false);
  }

  function handleDeleteClick(id, todo) {
    setOpen(true);
    setMessage(todo.text);
    setId(id);
  }

  function handleToggleDone(id) {
    setTodos(toggleTodoDone(db, id));
  }

  function handleEditClick(todo) {
    setIsEditing(true);
    setCurrentTodo({ ...todo });
  }

  function taskDelete(id) {
    setTodos(deleteTodo(db, id));
    setOpen(false);
  }
const [view, setView] = useState('dashboard'); // 'dashboard' | 'pending' | 'completed'

function handleCardClick(type) {
  setView(type);
}

function handleBackClick() {
  setView('dashboard');
}
if (loading) {
  return <div className="App">Loading…</div>;
}

return (
  <div className="App app-layout">
    {view == 'dashboard' && <TodoStats todos={todos} onSelect={handleCardClick} />}

    {view !== 'dashboard' && (
      <div className="main-content">
        <button className="back-button" onClick={handleBackClick}>
          ← Back to dashboard
        </button>

        <h2>{view === 'pending' ? 'Pending Todos' : 'Completed Todos'}</h2>

        {view === 'pending' && (
          isEditing ? (
            <EditForm
              currentTodo={currentTodo}
              setIsEditing={setIsEditing}
              onEditInputChange={handleEditInputChange}
              onEditFormSubmit={handleEditFormSubmit}
            />
          ) : (
            <form onSubmit={handleFormSubmit}>
              <label htmlFor="todo">Add todo: </label>
              <input
                name="todo"
                type="text"
                placeholder="Create a new todo"
                value={todo}
                onChange={handleInputChange}
              />
              <Button variant="text" type="submit">Add</Button>
            </form>
          )
        )}

        <ul className="todo-list">
          {todos
            .filter((t) => (view === 'pending' ? !t.done : t.done))
            .map((todo) => (
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
    )}
  </div>
);
}