import React from 'react';
import { formatDateToDDMMYYYY, createLowercaseDBField } from '../../utils/transform';

const FIELDS = [
  { label: 'Job Id', type: 'uneditable' },
  { label: 'Job Number', type: 'uneditable' },
  { label: 'Position', type: 'uneditable' },
  { label: 'Advertiser', type: 'uneditable' },
  { label: 'Location', type: 'uneditable' },
  { label: 'Work Type', type: 'uneditable' },
  { label: 'Salary', type: 'single-editable' },
  { label: 'Expired', type: 'boolean-editable' },
  { label: 'Job URL', type: 'launchable' },
  { label: 'Job Date', type: 'date-editable' },
  { label: 'Title', type: 'single-editable' },
  { label: 'Comments', type: 'multi-editable' },
  { label: 'Requirements', type: 'multi-editable' },
  { label: 'Follow Up', type: 'single-editable' },
  { label: 'Highlight', type: 'single-editable' },
  { label: 'Applied', type: 'single-editable' },
  { label: 'Application Date', type: 'date-editable' },
  { label: 'Contact', type: 'multi-editable' },
  { label: 'Application Comments', type: 'multi-editable' },
  { label: 'Unsuccessful', type: 'multi-editable' },
  { label: 'Updated At', type: 'uneditable' }
];

const JOB_PREVIEW_WINDOW_NAME = "jobPreview";

function openJobPreview(url) {
  if (!url) return;

  // Reuse the same window/tab by name
  const win = window.open(url, JOB_PREVIEW_WINDOW_NAME);

  // If blocked, do nothing here (let the user use the link),
  // or optionally show a toast / set state.
  if (win) win.focus();
}

const isEditableType = (type) =>
  type === 'single-editable' ||
  type === 'multi-editable' ||
  type === 'date-editable' ||
  type === 'boolean-editable';

const DataTable = ({
  data,
  jobDetailsMap,
  onRowClick,
  editingRow,
  editingValue,
  editingDateValue,
  onEditValueChange,
  onUpdateRow,
  onEditDateChange,
  selectedJobId,
  onJobClick
}) => (
  <div className="table-container-1">
    <table>
      <thead>
        <tr>
          <th>Job Number</th>
          <th>Matching Terms</th>
          {FIELDS.map((field) => (
            <th key={field.label}>{field.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((job) => {
          const details = jobDetailsMap[job.job_id] || {};

          const renderCell = (field) => {
            console.log("renderCell(",
              field.label,
              field.type,
              job.job_id,
              editingRow,
              editingRow ? editingRow.jobId : null,
              editingRow ? editingRow.fieldLabel : null,
              job.job_id, ")");
            const fieldName = createLowercaseDBField(field.label);
            const fieldValue = details[fieldName];
            const isEditing =
              editingRow &&
              editingRow.jobId === job.job_id &&
              editingRow.fieldLabel === field.label;
            if (isEditing) {
              console.log("Rendering edit mode for:", job.job_id, field.label, "Value:", fieldValue);
            }

            switch (field.type) {
              case 'boolean-editable':
                return isEditing ? (
                  <>
                    <select
                      value={editingValue === true ? 'true' : editingValue === false ? 'false' : ''}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        const v = e.target.value;
                        onEditValueChange(v === '' ? null : v === 'true');
                      }}
                    >
                      <option value="">-</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                    <button onClick={(e) => { e.stopPropagation(); onUpdateRow(); }}>
                      Save
                    </button>
                  </>
                ) : (
                  fieldValue === true
                    ? 'Yes'
                    : fieldValue === false
                      ? 'No'
                      : '-'
                );
              case 'launchable':
                return fieldValue ? (
                  <a
                    className="table-link"
                    href={fieldValue}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      openJobPreview(fieldValue);
                    }}
                  >
                    {fieldValue} ↗
                  </a>
                ) : '-';
              case 'single-editable':
                return isEditing ? (
                  <>
                    <input
                      value={editingValue}
                      onChange={(e) => onEditValueChange(e.target.value)}
                      onBlur={onUpdateRow}
                      autoFocus
                    />
                    <button onClick={onUpdateRow}>Save</button>
                  </>
                ) : (
                  fieldValue || '-'
                );
              case 'multi-editable':
                return isEditing ? (
                  <>
                    <textarea
                      value={editingValue}
                      onChange={(e) => onEditValueChange(e.target.value)}
                      onBlur={onUpdateRow}
                      autoFocus
                    />
                    <button onClick={onUpdateRow}>Save</button>
                  </>
                ) : (
                  fieldValue || '-'
                );
              case 'date-editable': {
                const displayValue = fieldValue ? formatDateToDDMMYYYY(fieldValue) : '-';
                return isEditing ? (
                  <>
                    <input
                      value={editingDateValue}
                      onChange={onEditDateChange}
                      onBlur={onUpdateRow}
                      autoFocus
                    />
                    <button onClick={onUpdateRow}>Save</button>
                  </>
                ) : (
                  displayValue
                );
              }
              case 'uneditable':
              default:
                return fieldValue || '-';
            }
          };

          return (
            <tr
              key={job.job_id}
              className={job.job_id === selectedJobId ? 'selected-row' : ''}
              onClick={() => onJobClick(job.job_id, job.job_number)}
            >
              <td>{job.job_number}</td>
              <td>{job.matching_terms}</td>
              {FIELDS.map((field) => (
                <td
                  key={field.label}
                  className={
                    field.type === 'multi-editable' &&
                      (!editingRow ||
                        editingRow.jobId !== job.job_id ||
                        editingRow.fieldLabel !== field.label)
                      ? 'left-align-pre-wrap'
                      : ''
                  }
                  style={{ cursor: isEditableType(field.type) ? 'pointer' : 'default' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEditableType(field.type)) {
                      onRowClick({ jobId: job.job_id, fieldLabel: field.label });
                    }
                  }}
                >
                  {renderCell(field)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default DataTable;
