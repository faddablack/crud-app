import './TodoStats.css';

export default function TodoStats({ todos, onSelect }) {
  const completed = todos.filter(t => t.done).length;
  const pending = todos.length - completed;

  return (
    <div className="todo-stats">
      <h3 className="todo-stats-title">Todos</h3>
      <div className="todo-stats-row">
        <button className="stat-card" onClick={() => onSelect('pending')}>
          <span className="stat-value">{pending}</span>
          <span className="stat-label">Pending</span>
        </button>
        <button className="stat-card" onClick={() => onSelect('completed')}>
          <span className="stat-value">{completed}</span>
          <span className="stat-label">Completed</span>
        </button>
      </div>
    </div>
  );
}