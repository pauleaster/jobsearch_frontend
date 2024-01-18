import React from 'react';
import { createLowercaseDBField } from '../../utils/transform';


const JobDetailsTable = ({ details, onRowClick, editingRow, editingValue, onEditValueChange, onUpdateRow }) => {
    if (!details) return null;


    const renderLaunchableRow = (label, value) => {
      const fieldName = createLowercaseDBField(label);
      const fieldValue = details[fieldName];

      return (
        <tr key={label}>
          <td>{label}</td>
          <td>
            {fieldValue ? (
              <a href={fieldValue} target="_blank" rel="noopener noreferrer" className="table-link">
                {fieldValue} ↗
              </a>
            ) : (
              '-'
            )}
          </td>
        </tr>
      );
    };
  
    
    const renderSingleLineEditableRow  = (label, value) => {

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
  
    const renderMultiLineEditableRow  = (label, value) => {

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
    
    
  
    return (
      <div className="table-container">
        <table>
          <tbody>
            {renderUneditableRow('Job Id', details.job_id)}
            {renderUneditableRow('Job Number', details.job_number)}
            {renderLaunchableRow('Job URL', details.job_url)}
            {renderSingleLineEditableRow ('Title', details.title)}
            {renderMultiLineEditableRow('Comments', details.comments)}
            {renderMultiLineEditableRow('Requirements', details.requirements)}
            {renderSingleLineEditableRow ('Follow Up', details.follow_up)}
            {renderSingleLineEditableRow ('Highlight', details.highlight)}
            {renderSingleLineEditableRow ('Applied', details.applied)}
            {renderMultiLineEditableRow('Contact', details.contact)}
            {renderMultiLineEditableRow('Application Comments', details.application_comments)}
          </tbody>
        </table>
      </div>
    );
  }

export default JobDetailsTable;
