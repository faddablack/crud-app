import { Box, Button, Card } from "@mui/material";
import Checkbox from "./components/Checkbox";

export default function TodoItem({
  todo,
  onEditClick,
  onDeleteClick,
  onToggleDone
}) {
  return (
    <li>
      <Card variant="outlined" sx={{ maxWidth: 360, p: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Checkbox checked={!!todo.done} onChange={() => onToggleDone(todo.id)} />
          <span
            style={{
              textDecoration: todo.done ? "line-through" : "none",
              flex: 1,
            }}
          >
            {todo.text}
          </span>
          {todo.created_at && (
            <span
              style={{
                fontSize: "11px",
                color: "#9ca3af",
                whiteSpace: "nowrap",
                marginLeft: 8,
              }}
            >
              {new Date(todo.created_at).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          )}
        </Box>

        <Box sx={{ marginLeft: "32px", marginTop: "8px" }}>
          <Button size="small" variant="outlined" onClick={() => onEditClick(todo)}>
            Edit
          </Button>
          <Button size="small" variant="outlined" color="error" onClick={() => onDeleteClick(todo.id)} sx={{ ml: 1 }}>
            Delete
          </Button>
        </Box>
      </Card>
    </li>
  );
}