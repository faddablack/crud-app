import React from 'react';

function Checkbox({ isChecked, onChange }) {
  return (
    <input 
      type="checkbox" 
      checked={isChecked} 
      onChange={(e) => alert(e.target.checked)} 
      style={{ cursor: 'pointer', width: '20px', height: '20px' }}
    />
  );
}

export default Checkbox;