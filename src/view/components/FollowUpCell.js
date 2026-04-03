import React, { useState, useRef, useEffect } from 'react';

const FollowUpCell = ({ value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const startEdit = (e) => {
    e.stopPropagation();
    setDraft(value || '');
    setEditing(true);
  };

  const commit = () => {
    setEditing(false);
    if (draft !== (value || '')) onSave(draft);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    if (e.key === 'Escape') { setEditing(false); }
  };

  return (
    <div className="follow-up-cell">
      {editing ? (
        <input
          ref={inputRef}
          className="follow-up-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          className="follow-up-value"
          title="Click to edit"
          onClick={startEdit}
        >
          {value || '-'}
        </div>
      )}
      <div>
        <button className="follow-up-btn" onClick={(e) => { e.stopPropagation(); onSave('Yes'); }}>Yes</button>
        <button className="follow-up-btn" onClick={(e) => { e.stopPropagation(); onSave('No'); }}>No</button>
      </div>
    </div>
  );
};

export default FollowUpCell;