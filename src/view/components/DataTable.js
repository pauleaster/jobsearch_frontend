import React from 'react';

const DataTable = ({ data, onJobClick, selectedJobId  }) => {
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Job Number</th>
              <th>Matching Terms</th>
            </tr>
          </thead>
          <tbody>
            {data.map((job) => (
            <tr key={job.job_id} 
            onClick={() => onJobClick(job.job_id, job.job_number)}
            className={job.job_id === selectedJobId ? 'selected-row' : ''}
            >
            <td>{job.job_number}</td>
            <td>{job.matching_terms}</td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

export default DataTable;
