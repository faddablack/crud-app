// notice we are destructuring the props here. You could change this to 
// bring in props instead and then just add `props.` to todo, onEditClick and onDeleteClick:
// export default function TodoItem(props)
export default function TodoItem({
  // passing the todo as a prop
  todo,
  // notice the name change of the function handleEditClick to onEditClick 
  onEditClick,
  // notice the name change of the function handleDeleteClick to onDeleteClick
  onDeleteClick
}) {
  return (
    // using the li element as the parent 
    <li key={todo.id}>
      {todo.text}
      {/* don't forget to change the name of the functions */}
      <button onClick={() => onEditClick(todo)}>Edit</button>
      <button onClick={() => onDeleteClick(todo.id)}>Delete</button>
    </li>
  );
}