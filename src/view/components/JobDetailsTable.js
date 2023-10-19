import React from 'react';

function JobDetailsTable({ details }) {
    if (!details) return null;
  
    const renderRow = (label, value) => (
      <tr key={label}>
        <td>{label}</td>
        <td>{value || '-'}</td>
      </tr>
    );
  
    return (
      <div className="table-container">
        <table>
          <tbody>
            {renderRow('Job Id', details.job_id)}
            {renderRow('Job Number', details.job_number)}
            {renderRow('Job URL', details.job_url)}
            {renderRow('Title', details.title)}
            {renderRow('Comments', details.comments)}
            {renderRow('Requirements', details.requirements)}
            {renderRow('Follow Up', details.follow_up)}
            {renderRow('Highlight', details.highlight)}
            {renderRow('Applied', details.applied)}
            {renderRow('Contact', details.contact)}
            {renderRow('Application Comments', details.application_comments)}
          </tbody>
        </table>
      </div>
    );
  }

export default JobDetailsTable;
