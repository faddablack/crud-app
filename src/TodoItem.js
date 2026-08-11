import { Box, Button, Card } from "@mui/material";
import Checkbox from "./components/Checkbox";

function formatTimestamp(value) {
  return new Date(value).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TodoItem({
  todo,
  onEditClick,
  onDeleteClick,
  onToggleDone
}) {
  const wasEdited =
    todo.updated_at && todo.updated_at !== todo.created_at;

  return (
    <li>
      <Card variant="outlined" sx={{ maxWidth: 360, p: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Checkbox checked={!!todo.done} onChange={() => onToggleDone(todo.id)} />
          <span
            style={{
              textDecoration: todo.done ? "line-through" : "none",
              flex: 1,
              paddingTop: "2px",
            }}
          >
            {todo.text}
          </span>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              marginLeft: 1,
            }}
          >
            {todo.created_at && (
              <span
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  whiteSpace: "nowrap",
                }}
              >
                {formatTimestamp(todo.created_at)}
              </span>
            )}
            {wasEdited && (
              <span
                style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  fontStyle: "italic",
                  whiteSpace: "nowrap",
                }}
              >
                Edited {formatTimestamp(todo.updated_at)}
              </span>
            )}
          </Box>
        </Box>

        <Box sx={{ marginTop: "8px" }}>
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