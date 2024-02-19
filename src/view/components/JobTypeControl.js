// JobTypeControl.js
import React from 'react';

const JobTypeControl = ({ jobTypeLabel, jobTypeValue, setJobTypeValue }) => {
  const handleEnableChange = (event) => {
    // If unchecked, set to null. Otherwise, default to true.
    setJobTypeValue(event.target.checked ? true : null);
  };

  const handleValueChange = (value) => {
    setJobTypeValue(value);
  };

  return (
    <div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={jobTypeValue !== null}
          onChange={handleEnableChange}
        /> Enable {jobTypeLabel}
      </label>
      <label style={{ marginLeft: '10px' }}>
        <input
          type="checkbox"
          checked={jobTypeValue === true}
          onChange={() => handleValueChange(!jobTypeValue)}
        /> True
      </label>
    </div>
  </div>
  );
};

export default JobTypeControl;
