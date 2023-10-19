import React, { useState } from 'react';
import { fetchData, fetchJobDetails } from '../model/api';
import App from '../view/App';

function AppController() {
    const [jobs, setJobs] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);

    const handleFetchData = async () => {
        const data = await fetchData();
        setJobs(data);
    };

    const handleJobClick = async (jobId) => {
        const details = await fetchJobDetails(jobId);
        setJobDetails(details);
    };

    return (
        <App
            jobs={jobs}
            jobDetails={jobDetails}
            onFetchData={handleFetchData}
            onJobClick={handleJobClick}
        />
    );
}

export default AppController;
