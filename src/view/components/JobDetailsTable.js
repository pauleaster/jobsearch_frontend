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
  
    
    const renderEditableRow = (label, value) => {

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
            {renderEditableRow('Title', details.title)}
            {renderEditableRow('Comments', details.comments)}
            {renderEditableRow('Requirements', details.requirements)}
            {renderEditableRow('Follow Up', details.follow_up)}
            {renderEditableRow('Highlight', details.highlight)}
            {renderEditableRow('Applied', details.applied)}
            {renderEditableRow('Contact', details.contact)}
            {renderEditableRow('Application Comments', details.application_comments)}
          </tbody>
        </table>
      </div>
    );
  }

export default JobDetailsTable;
