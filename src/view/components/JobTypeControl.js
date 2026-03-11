// JobTypeControl.js
import React from 'react';

const JobTypeControl = ({
  jobTypeLabel,
  jobTypeValue,
  setJobTypeValue,
  enableLabelText,
  trueLabelText,
}) => {
  const handleEnableChange = (event) => {
    // If unchecked, set to null. Otherwise, default to true.
    setJobTypeValue(event.target.checked ? true : null);
  };

  const handleValueChange = (value) => {
    setJobTypeValue(value);
  };

  return (
    <div className="job-type-control">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={jobTypeValue !== null}
            onChange={handleEnableChange}
          /> {enableLabelText ?? `Enable ${jobTypeLabel}`}
        </label>
        <label style={{ marginLeft: '10px' }}>
          <input
            type="checkbox"
            checked={jobTypeValue === true}
            onChange={() => handleValueChange(!jobTypeValue)}
          /> {trueLabelText ?? 'True'}
        </label>
      </div>
    </div>
  );
};

export default JobTypeControl;
