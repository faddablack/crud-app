JavaScript
import React from 'react';
import Checkbox from './Checkbox'; // Importing the sibling component

function TaskItem({ task, onUpdate, onDelete }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '10px 15px',
      borderRadius: '6px',
      marginBottom: '10px',
      width: '100%',
      maxWidth: '400px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Checkbox 
          isChecked={task.completed} 
          onChange={() => onUpdate(task.id)} 
        />
        <span style={{ 
          textDecoration: task.completed ? 'line-through' : 'none',
          color: task.completed ? '#aaa' : '#fff',
          fontSize: '18px'
        }}>
          {task.text}
        </span>
      </div>
      <button 
        onClick={() => onDelete(task.id)}
        style={{
          background: '#ff4d4d',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Delete
      </button>
    </div>
  );
}

export default TaskItem;