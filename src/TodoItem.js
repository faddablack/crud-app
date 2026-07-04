import { Box, Button, Card } from "@mui/material";
import Checkbox from "./components/Checkbox";

export default function TodoItem({
  todo,
  onEditClick,
  onDeleteClick,
  onToggleDone
}) {
  return (
     <Card variant="outlined" sx={{ maxWidth: 360 }}>
    <li key={todo.id}>
        <Box sx={{ '& button': { m: 1 } }}>
      <Checkbox checked={!!todo.done} onChange={() => onToggleDone(todo.id)} />
      <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
        {todo.text}
      </span>
      <Button size="small" variant="outlined" onClick={() => onEditClick(todo)}>Edit</Button>
     <Button size="small" variant="outlined" color="error" onClick={() => onDeleteClick(todo.id)}>Delete</Button>
     </Box>
    </li>
    </Card>
  );
}