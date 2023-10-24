import React, { useState } from 'react';
import { fetchData, fetchJobDetails, patchJobDetails } from '../model/api';
import App from '../view/App';
import { createLowercaseDBField } from '../utils/transform';

const AppController = () => {
    const [jobs, setJobs] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    

    const handleFetchData = async () => {
        const data = await fetchData();
        setJobs(data);
    };

    const handleJobClick = async (jobId) => {
        const details = await fetchJobDetails(jobId);
        setJobDetails(details);
    };

    const handleRowClick = (label) => {
        console.log("handleRowClick(", label, ")");
        if (jobDetails) {
            setEditingRow(label);
            const dbField = createLowercaseDBField(label);
            const fieldValue = jobDetails[dbField];
            setEditingValue(fieldValue);
        }
    };

    const handleUpdateRow = async () => {
        console.log("handleUpdateRow()");
        if (editingRow && jobDetails) {
            console.log("Launching patchJobDetails(", jobDetails.job_id, editingRow, editingValue,")");
            await patchJobDetails(jobDetails.job_id, editingRow, editingValue);
            setEditingRow(null);
            setEditingValue('');
            // Optionally, refresh job details after updating
            handleJobClick(jobDetails.job_id);
        }
    };

    const handleSaveWithConfirmation = async () => {
        if (window.confirm("Are you sure you want to save the changes?")) {
            await handleUpdateRow();  // only call the original update function if the user confirms
        }
        // Fetch latest job details
        const updatedJobDetails = await fetchJobDetails(jobDetails.job_id,);  // Assuming you have the current job's ID stored in a state or variable
        setJobDetails(updatedJobDetails);  // Update the jobDetails state with the latest details
    }
    
    

    return (
        <App
            jobs={jobs}
            jobDetails={jobDetails}
            onFetchData={handleFetchData}
            onJobClick={handleJobClick}
            onRowClick={handleRowClick}
            editingRow={editingRow}
            editingValue={editingValue}
            onEditValueChange={setEditingValue}
            onUpdateRow={handleSaveWithConfirmation}
        />
    );
}

export default AppController;
