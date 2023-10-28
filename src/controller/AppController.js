// src>controller>AppController.js
import React, { useState } from 'react';
import { fetchData, fetchSearchTerms, fetchJobDetails, patchJobDetails } from '../model/api';
import App from '../view/App';
import { createLowercaseDBField } from '../utils/transform';
import SaveConfirmationDialog from '../view/components/SaveConfirmationDialog';
import SearchTerms from '../view/components/SearchTerms';

const AppController = () => {
    const [jobs, setJobs] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobsFetched, setJobsFetched] = useState(false);
    const [searchTerms, setSearchTerms] = useState([]);
    const [showSearchTerms, setShowSearchTerms] = useState(false);
    const [selectedTerms, setSelectedTerms] = useState(new Set());

    

    const handleFetchData = async () => {
        const data = await fetchData();
        setJobs(data);
        setJobsFetched(true);  // Set to true once data is fetched
    };

    const handleFilterClick = async () => {
        const fetchedSearchTerms = await fetchSearchTerms();
        if (fetchedSearchTerms) {
            setSearchTerms(fetchedSearchTerms);
            setShowSearchTerms(true); // Show the search terms table
        }
        console.log("Filter Jobs button clicked");
    };

    const toggleTermSelection = (term) => {
        const newSelectedTerms = new Set(selectedTerms);
        if (newSelectedTerms.has(term)) {
            newSelectedTerms.delete(term);
        } else {
            newSelectedTerms.add(term);
        }
        setSelectedTerms(newSelectedTerms);
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
                jobsFetched={jobsFetched}
                onFetchData={handleFetchData}
                onFilterClick={handleFilterClick}
                searchTerms={searchTerms}
                showSearchTerms={showSearchTerms}
                onJobClick={handleJobClick}
                onRowClick={handleRowClick}
                editingRow={editingRow}
                editingValue={editingValue}
                onEditValueChange={setEditingValue}
                onUpdateRow={handleSaveWithConfirmation}
            />

            <SearchTerms 
                searchTerms={searchTerms} 
                selectedTerms={selectedTerms} 
                onToggleTerm={toggleTermSelection} 
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
