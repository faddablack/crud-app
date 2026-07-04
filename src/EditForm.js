import { Button } from "@mui/material";

export default function EditForm({
  // still need the currentTodo 
  currentTodo,
  // also need to be able to toggle setIsEditing
  setIsEditing,
  // notice the name change of the function handleEditInputChange to onEditInputChange
  onEditInputChange,
  // notice the name change of the function handleEditFormSubmit to onEditFormSubmit
  onEditFormSubmit
}) {
  return (
    // using the form element as the parent 
    // notice the change for the function names in the onSubmit and onChange props
    <form onSubmit={onEditFormSubmit}>
      <h2>Edit Todo</h2>
      <label htmlFor="updateTodo">Update todo: </label>
      <input
        name="updateTodo"
        type="text"
        placeholder="Update todo"
        value={currentTodo.text}
        onChange={onEditInputChange}
      />
      <Button variant="outlined" size="small" type="submit" onClick={onEditFormSubmit}>
        Update
      </Button>
      <Button onClick={() => setIsEditing(false)}>Cancel</Button>
    </form>
  );
}