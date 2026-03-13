import React from 'react';
import { formatDateToDDMMYYYY, createLowercaseDBField } from '../../utils/transform';
import HeaderCell from './HeaderCell';

const FIELDS = [
  // { label: 'Job Id', type: 'uneditable' },
    { label: 'Expired', type: 'boolean-editable' },
  { label: 'Position', type: 'uneditable' },
  { label: 'Advertiser', type: 'uneditable' },
  { label: 'Location', type: 'uneditable' },
  { label: 'Work Type', type: 'uneditable' },
  { label: 'Salary', type: 'single-editable' },
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
  onSelectRow,
  handleHeaderOnClick,
  activeSort,
  selectedTerms
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
            visualState={activeSort.column === "Matching Terms" ? "down" : "none"}
            onClick={() => handleHeaderOnClick("Matching Terms")}
          />
          {FIELDS.map((field) => (
            <HeaderCell
              key={field.label}
              name={field.label}
              visualState={activeSort.column === field.label ? activeSort.direction : "none"}
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
                      e.stopPropagation();
                      onSelectRow?.(job.job_id);
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
              <td>
                {details.job_url ? (
                  <a
                    className="table-link"
                    href={details.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelectRow?.(job.job_id);
                      openJobPreview(details.job_url);
                    }}
                  >
                    {job.job_number} ↗
                  </a>
                ) : (
                  job.job_number || '-'
                )}
              </td>
              <td className="matching-terms-cell">
                {Array.isArray(job.search_terms) && job.search_terms.length > 0 ? (
                  <div className="matching-terms">
                    {job.search_terms.map((term) => (
                      <span
                        key={term}
                        className={`matching-term ${selectedTerms?.has(term) ? 'is-selected' : ''}`}
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                ) : (
                  job.matching_terms || '-'
                )}
              </td>

              {FIELDS.map((field) => {
                const isMulti = field.type === 'multi-editable';
                const isEditing =
                  editingRow &&
                  editingRow.jobId === job.job_id &&
                  editingRow.fieldLabel === field.label;

                return (
                  <td
                    key={field.label}
                    style={{ cursor: isEditableType(field.type) ? 'pointer' : 'default' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isEditableType(field.type)) {
                        onRowClick({ jobId: job.job_id, fieldLabel: field.label });
                      }
                    }}
                  >
                    {isMulti && !isEditing ? (
                      <div className="multi-editable-cell">
                        {renderCell(field)}
                      </div>
                    ) : (
                      renderCell(field)
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default DataTable;
