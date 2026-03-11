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

  const handleValueChange = (event) => {
    setJobTypeValue(event.target.checked);
  };

  return (
    <div className={`job-type-control ${jobTypeValue !== null ? 'enabled' : ''}`}>
      <div className="job-type-row">
        <label className="job-type-option">
          <input
            type="checkbox"
            checked={jobTypeValue !== null}
            onChange={handleEnableChange}
          />
          <span>{enableLabelText ?? `Enable ${jobTypeLabel}`}</span>
        </label>

        <label className="job-type-option secondary">
          <input
            type="checkbox"
            checked={jobTypeValue === true}
            onChange={handleValueChange}
            // disabled={jobTypeValue === null}
          />
          <span>{trueLabelText ?? 'True'}</span>
        </label>
      </div>
    </div>
  );
};

export default JobTypeControl;
