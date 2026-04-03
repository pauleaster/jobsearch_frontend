import React from 'react';

const ExpiredCell = ({ value, onSave }) => (
  <div className="follow-up-cell">
    <div>{value === true ? 'Yes' : value === false ? 'No' : '-'}</div>
    <div>
      <button className="follow-up-btn" onClick={(e) => { e.stopPropagation(); onSave(true); }}>Yes</button>
      <button className="follow-up-btn" onClick={(e) => { e.stopPropagation(); onSave(false); }}>No</button>
    </div>
  </div>
);

export default ExpiredCell;