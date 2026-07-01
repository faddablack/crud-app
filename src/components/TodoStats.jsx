import './TodoStats.css';

export default function TodoStats({ todos }) {
  const completed = todos.filter(t => t.done).length;
  const pending = todos.length - completed;

  return (
    <div className="todo-stats">
      <h3 className="todo-stats-title">Todos</h3>
      <div className="todo-stats-row">
        <div className="stat-card">
          <span className="stat-value">{pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>
    </div>
  );
}