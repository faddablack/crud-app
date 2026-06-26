import Checkbox from "./components/Checkbox";

export default function TodoItem({
  todo,
  onEditClick,
  onDeleteClick,
  onToggleDone
}) {
  return (
    <li key={todo.id}>
      <Checkbox checked={!!todo.done} onChange={() => onToggleDone(todo.id)} />
      <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
        {todo.text}
      </span>
      <button onClick={() => onEditClick(todo)}>Edit</button>
      <button onClick={() => onDeleteClick(todo.id)}>Delete</button>
    </li>
  );
}