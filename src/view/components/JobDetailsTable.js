import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the CSS
import { formatDateToDDMMYYYY } from '../../utils/transform';

import { createLowercaseDBField } from '../../utils/transform';


const JOB_PREVIEW_WINDOW_NAME = "jobPreview";

function openJobPreview(url) {
  if (!url) return;

  // Reuse the same window/tab by name
  const win = window.open(url, JOB_PREVIEW_WINDOW_NAME);

  // If blocked, do nothing here (let the user use the link),
  // or optionally show a toast / set state.
  if (win) win.focus();
}


const JobDetailsTable = ({ details, onRowClick, editingRow, editingValue, editingDateValue, onEditValueChange, onUpdateRow, onEditDateChange }) => {

  if (!details) return null;

  // console.log("JobDetailsTable props:", { details, onRowClick, editingRow, editingValue, editingDateValue, onEditValueChange, onUpdateRow, onEditDateChange });


  const renderLaunchableRow = (label) => {
    const fieldName = createLowercaseDBField(label);
    const fieldValue = details[fieldName];

    const clickable = Boolean(fieldValue);

    return (
      <tr
        key={label}
        style={{ cursor: clickable ? "pointer" : "default" }}
        onClick={() => clickable && openJobPreview(fieldValue)}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        onKeyDown={(e) => {
          if (!clickable) return;
          if (e.key === "Enter" || e.key === " ") openJobPreview(fieldValue);
        }}
      >
        <td>{label}</td>
        <td>
          {fieldValue ? (
            <a
              className="table-link"
              href={fieldValue}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                // Don’t let the row click fire as well
                e.stopPropagation();
                // Still reuse the named window (instead of opening many tabs)
                e.preventDefault();
                openJobPreview(fieldValue);
              }}
            >
              {fieldValue} ↗
            </a>
          ) : (
            "-"
          )}
        </td>
      </tr>
    );
  };


  const renderSingleLineEditableRow = (label, value) => {

    const fieldName = createLowercaseDBField(label);
    const fieldValue = details[fieldName];
    return (
      <tr key={label} onClick={() => onRowClick(label)}>
        <td>{label}</td>
        <td>
          {editingRow === label ? (
            <>
              <input
                value={editingValue}
                onChange={(e) => onEditValueChange(e.target.value)}
                onBlur={onUpdateRow}
              />
              <button onClick={onUpdateRow}>Save</button>
            </>
          ) : (
            fieldValue || '-'
          )}
        </td>
      </tr>
    );
  };

  const renderMultiLineEditableRow = (label, value) => {

    const fieldName = createLowercaseDBField(label);
    const fieldValue = details[fieldName];
    return (
      <tr key={label} onClick={() => onRowClick(label)}>
        <td>{label}</td>
        <td className={editingRow === label ? "" : "left-align-pre-wrap"}>
          {editingRow === label ? (
            <>
              <textarea
                value={editingValue}
                onChange={(e) => onEditValueChange(e.target.value)}
                onBlur={onUpdateRow}
              />
              <button onClick={onUpdateRow}>Save</button>
            </>
          ) : (
            fieldValue || '-'
          )}
        </td>
      </tr>
    );
  };

  const renderUneditableRow = (label, value) => {

    const fieldName = createLowercaseDBField(label);
    const fieldValue = details[fieldName];

    return (
      <tr key={label}>
        <td>{label}</td>
        <td>{fieldValue || '-'}</td>
      </tr>
    );
  };

  const renderDateEditableRow = (label, value) => {

    const fieldName = createLowercaseDBField(label);
    // console.log("renderDateEditableRow: fieldName:", fieldName);
    const fieldValue = details[fieldName];
    // console.log("renderDateEditableRow: fieldValue:", fieldValue);

    // Convert the ISO format date to dd/MM/yyyy format for display
    const displayValue = fieldValue ? formatDateToDDMMYYYY(fieldValue) : '-';
    // console.log("renderDateEditableRow: displayValue:", displayValue);

    return (
      <tr key={label} onClick={() => onRowClick(label)}>
        <td>{label}</td>
        <td>
          {editingRow === label ? (
            <>
              <input
                value={editingDateValue}
                onChange={onEditDateChange}
                onBlur={onUpdateRow}
              />
              <button onClick={onUpdateRow}>Save</button>
            </>
          ) : (
            displayValue
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="table-container">
      <table>
        <tbody>
          {renderUneditableRow('Job Id', details.job_id)}
          {renderUneditableRow('Job Number', details.job_number)}
          {renderLaunchableRow('Job URL')}
          {renderDateEditableRow('Job Date', details.job_date)}
          {renderSingleLineEditableRow('Title', details.title)}
          {renderMultiLineEditableRow('Comments', details.comments)}
          {renderMultiLineEditableRow('Requirements', details.requirements)}
          {renderSingleLineEditableRow('Follow Up', details.follow_up)}
          {renderSingleLineEditableRow('Highlight', details.highlight)}
          {renderSingleLineEditableRow('Applied', details.applied)}
          {renderDateEditableRow('Application Date', details.application_date)}
          {renderMultiLineEditableRow('Contact', details.contact)}
          {renderMultiLineEditableRow('Application Comments', details.application_comments)}
          {renderMultiLineEditableRow('Unsuccessful', details.unsuccessful)}
          {renderUneditableRow('Position', details.position)}
          {renderUneditableRow('Advertiser', details.advertiser)}
          {renderUneditableRow('Location', details.location)}
          {renderUneditableRow('Work Type', details.work_type)}
          {renderSingleLineEditableRow('Salary', details.salary)}
          {renderSingleLineEditableRow('Expired', details.expired)}
          {renderUneditableRow('Updated At', details.updated_at)}
        </tbody>
      </table>
    </div>
  );
}

export default JobDetailsTable;
