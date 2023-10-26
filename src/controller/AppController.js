import React, { useState } from 'react';
import { fetchData, fetchJobDetails, patchJobDetails } from '../model/api';
import App from '../view/App';
import { createLowercaseDBField } from '../utils/transform';
import SaveConfirmationDialog from '../view/components/SaveConfirmationDialog';

const AppController = () => {
    const [jobs, setJobs] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    

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
            let fieldValue = jobDetails[dbField];
            if (fieldValue === null || fieldValue === undefined) {
                fieldValue = '';
            }
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
        setIsModalOpen(true);
    }    

    const handleConfirmSave = async () => {
        await handleUpdateRow();  // only call the original update function if the user confirms

        // Fetch latest job details
        const updatedJobDetails = await fetchJobDetails(jobDetails.job_id,);  // Assuming you have the current job's ID stored in a state or variable
        setJobDetails(updatedJobDetails);  // Update the jobDetails state with the latest details
        setIsModalOpen(false);  // Close the modal
    }
    
    const handleCloseModal = () => {
        if (jobDetails && editingRow) {
            // Retrieve the original value for the editing field
            const dbField = createLowercaseDBField(editingRow);
            const originalValue = jobDetails[dbField];
    
            // Set the editing value to the original value, even if it's null or undefined
            setEditingValue(originalValue);
        }
        // Close the modal
        setIsModalOpen(false);
    };
    
    

    return (
        <>
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

            <SaveConfirmationDialog
                isOpen={isModalOpen}
                onConfirm={handleConfirmSave}
                onClose={handleCloseModal}
            />
        </>

    );
}

export default AppController;
