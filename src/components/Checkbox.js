import React from 'react';

// Destructuring props directly in the arguments
function Checkbox({ isChecked, onChange }) {
  return (
    <input 
      type="checkbox" 
      checked={isChecked} 
      onChange={(e) => onChange(e.target.checked)} 
      style={{ cursor: 'pointer', width: '20px', height: '20px' }}
    />
  );
}

export default Checkbox;