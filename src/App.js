import React, { useState } from 'react';
import './App.css';

// DataTable Component
function DataTable({ data, onJobClick }) {
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
          <tr key={job.job_id} onClick={() => onJobClick(job.job_id, job.job_number)}>
          <td>{job.job_number}</td>
          <td>{job.matching_terms}</td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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


function App() {
  const [jobs, setJobs] = useState([]);
  // const [clickedJob, setClickedJob] = useState({});
  const [jobDetails, setJobDetails] = useState(null);



  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/validJobsAndSearchTerms');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("There was an error fetching the data", error);
    }
  };

  const fetchJobDetails = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/job/${jobId}`);
      const data = await response.json();
      const detailedJob = data[0];
      console.log("Fetched job details:", detailedJob); 
      setJobDetails(detailedJob);
    } catch (error) {
      console.error("There was an error fetching the job details", error);
    }
  };

  const handleJobClick = (jobId, jobNumber) => {
    // setClickedJob({ id: jobId, number: jobNumber });
    fetchJobDetails(jobId);

  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchData}>Fetch Jobs</button>
        <DataTable data={jobs} onJobClick={handleJobClick} />

        {jobDetails && <JobDetailsTable details={jobDetails} />
}
      </header>
    </div>
  );
}

export default App;
