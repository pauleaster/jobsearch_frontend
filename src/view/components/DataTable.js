import React from 'react';
import { formatDateToDDMMYYYY, createLowercaseDBField } from '../../utils/transform';
import HeaderCell from './HeaderCell';

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
  const win = window.open(url, JOB_PREVIEW_WINDOW_NAME);
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
  handleHeaderOnClick,
  activeSort,
}) => (
  <div className="table-container-1">
    <table>
      <thead>
        <tr>
          <HeaderCell
            name="Job Number"
            visualState={activeSort.column === "Job Number" ? activeSort.direction : "none"}
            onClick={() => handleHeaderOnClick("Job Number")}
          />
          <HeaderCell 
            name="Matching Terms"
            visualState={activeSort.column === "Matching Terms" ? activeSort.direction : "none"}
            onClick={() => handleHeaderOnClick("Matching Terms")}
          />
          {FIELDS.map((field) => (
            <HeaderCell 
              key={field.label}
              name={field.label}
              visualState={activeSort.column   === field.label ? activeSort.direction : "none"}
              onClick={() => handleHeaderOnClick(field.label)}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((job) => {
          const details = jobDetailsMap[job.job_id] || {};

          const renderCell = (field) => {
            const fieldName = createLowercaseDBField(field.label);
            const fieldValue = details[fieldName];
            const isEditing =
              editingRow &&
              editingRow.jobId === job.job_id &&
              editingRow.fieldLabel === field.label;

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
            >
              <td>{job.job_number}</td>
              <td>
                {Array.isArray(job.search_terms)
                  ? job.search_terms.join(', ')
                  : (job.matching_terms || '-')}
              </td>
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
