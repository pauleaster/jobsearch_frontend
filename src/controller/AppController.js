// src>controller>AppController.js
import React, { useState, useEffect, useCallback } from 'react';
import { fetchData, fetchFilteredData, fetchSearchTerms, fetchJobDetails, patchJobDetails } from '../model/api';
import App from '../view/App';
import { createLowercaseDBField } from '../utils/transform';
import SaveConfirmationDialog from '../view/components/SaveConfirmationDialog';

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
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [currentJobs, setCurrentJobs] = useState(null); // Can be null, true, or false
    const [appliedJobs, setAppliedJobs] = useState(null); // Can be null, true, or false





    
    const handleFetchData = async () => {
        // Call handleFilteredFetchData with an empty Set to signify no specific filter criteria
        setSelectedTerms(new Set()); // initialise to an empty set and save state
        await handleFilteredFetchData(new Set());
        // Since handleFilteredFetchData already sets jobs and jobsFetched,
        // there's no need to duplicate that logic here.
    };
    
    

    const handleFilterClick = async () => {
        const fetchedSearchTerms = await fetchSearchTerms();
        if (fetchedSearchTerms) {
            setSearchTerms(fetchedSearchTerms);
            setSelectedTerms(new Set(fetchedSearchTerms)); // Set all fetched terms as selected
            setShowSearchTerms(true); // Show the search terms table
            // console.log("handleFilterClick: handleToggleTerm type:", typeof handleToggleTerm); 
        }
        else {
            console.log("handleFilterClick: fetchSearchTerms returned null");
        }
        
    };

    const handleFilteredFetchData = useCallback(async (selectedTermsSet ) => {
        const toggledSelectedTerms = Array.from(selectedTermsSet);
        console.log("handleFilteredFetchData: toggledSelectedTerms:", toggledSelectedTerms);
        console.log("handleFilteredFetchData(currentJobs, appliedJobs):", currentJobs, appliedJobs);
        const data = await fetchFilteredData(toggledSelectedTerms, currentJobs, appliedJobs);
        setJobs(data);
        setJobsFetched(true);  // Set to true once data is fetched
    }, [currentJobs, appliedJobs]);
    

    const handleToggleTerm = (term) => {
        const newSelectedTerms = new Set(selectedTerms);
        if (newSelectedTerms.has(term)) {
            if (newSelectedTerms.size > 1) {
                newSelectedTerms.delete(term);
                console.log("handleToggleTerm: newSelectedTerms.delete(", term, ")");
            } else {
                return;
            }
        } else {
            newSelectedTerms.add(term);
            console.log("handleToggleTerm: newSelectedTerms.add(", term, ")");
        }
        setSelectedTerms(newSelectedTerms); // update state
        // launch handleFetchData with the selected terms, converting to an array first
        handleFilteredFetchData(newSelectedTerms);

    };

    useEffect(() => {
        console.log("AppController: showSearchTerms changed:", showSearchTerms);
        // console.log("AppController: handleToggleTerm type:", typeof handleToggleTerm); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSearchTerms]);

    // console.log("AppController: handleToggleTerm type:", typeof handleToggleTerm); // Should log 'function'

    const handleJobClick = async (jobId) => {
        console.log("handleJobClick(", jobId, ")");
        const details = await fetchJobDetails(jobId);
        console.log("handleJobClick: details:", details);
        setJobDetails(details);
        setSelectedJobId(jobId); // Update the selected job ID
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

    useEffect(() => {
        console.log("handleCurrentJobsChange: Current Jobs change:", currentJobs);
        console.log("handleAppliedJobsChange: Applied Jobs change:", appliedJobs);
        console.log("handleFilteredFetchData(selectedTerms):", selectedTerms);
        handleFilteredFetchData(selectedTerms);
    }, [currentJobs, appliedJobs, selectedTerms, handleFilteredFetchData])


    const handleCurrentJobsChange = (newValue) => {
        console.log("handleCurrentJobsChange: Current Jobs change:", newValue);
        setCurrentJobs(newValue);
    };
    

    const handleAppliedJobsChange = (newValue) => {
        console.log("handleAppliedJobsChange: Applied Jobs change:", newValue);
        setAppliedJobs(newValue);
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
                selectedTerms={selectedTerms}          // Added
                handleToggleTerm={handleToggleTerm}    // Added
                onJobClick={handleJobClick}
                onRowClick={handleRowClick}
                editingRow={editingRow}
                editingValue={editingValue}
                onEditValueChange={setEditingValue}
                onUpdateRow={handleSaveWithConfirmation}
                selectedJobId={selectedJobId}
                currentJobs={currentJobs}
                appliedJobs={appliedJobs}
                handleCurrentJobsChange={handleCurrentJobsChange}
                handleAppliedJobsChange={handleAppliedJobsChange}
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
