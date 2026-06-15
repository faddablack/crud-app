export default function AddTodoForm({
  // passing the todo as a prop
  todo,
  // notice the name change of the function handleAddFormSubmit to onAddFormSubmit
  onAddFormSubmit,
  // notice the name change of the function handleAddInputChange to onAddInputChange
  onAddInputChange
}) {
  return (
    // using the form element as the parent
    // notice the change for the function names in the onSubmit and onChange props
    <form onSubmit={onAddFormSubmit}>
      <h2>Add Todo</h2>
      <label htmlFor="todo">Create todo: </label>
      <input
        name="todo"
        type="text"
        placeholder="Create new todo"
        value={todo}
        onChange={onAddInputChange}
      />
    </form>
  );
}