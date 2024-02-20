// src>controller>AppController.js
import React, { useState, useEffect, useCallback } from 'react';
import { fetchData, fetchFilteredData, fetchSearchTerms, fetchJobDetails, patchJobDetails } from '../model/api';
import App from '../view/App';
import { createLowercaseDBField, isDateField, formatDateToDDMMYYYY, convertDDMMYYYYToISO } from '../utils/transform';
import SaveConfirmationDialog from '../view/components/SaveConfirmationDialog';

const AppController = () => {
    const [jobs, setJobs] = useState([]);
    const [jobDetails, setJobDetails] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [editingDateValue, setEditingDateValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobsFetched, setJobsFetched] = useState(false);
    const [searchTerms, setSearchTerms] = useState([]);
    const [showSearchTerms, setShowSearchTerms] = useState(false);
    const [selectedTerms, setSelectedTerms] = useState(new Set());
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [currentJobs, setCurrentJobs] = useState(null); // Can be null, true, or false
    const [appliedJobs, setAppliedJobs] = useState(null); // Can be null, true, or false


    // Define handleDateChange within AppController.js
    const handleDateChange = (event) => {
        try {
            const dateInDDMMYYYY = event.target.value;
            console.log("handleDateChange(", dateInDDMMYYYY, ")");
            // Assuming convertDDMMYYYYToISO function exists and does the conversion
            const dateInISO = convertDDMMYYYYToISO(dateInDDMMYYYY);
            console.log("handleDateChange: dateInISO:", dateInISO);
            console.log("handleDateChange: setEditingDateValue(", dateInISO, ")");
            setEditingDateValue(dateInISO);
        }
        catch (error) {
            console.error("handleDateChange: error:", error);
        }
    };

    // When passing the handler to the child component or using it directly,
    // you can directly assign handleDateChange to onEditDateChange prop or call it within an inline function




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

    const handleFilteredFetchData = useCallback(async (selectedTermsSet) => {
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
            fieldValue = fieldValue ?? ''; // Simplified check for null or undefined

            // Check if the field is a date field
            if (isDateField(label)) {
                // Convert the fieldValue to dd/MM/yyyy format before setting
                const formattedDate = fieldValue ? formatDateToDDMMYYYY(fieldValue) : '';
                setEditingDateValue(formattedDate);
            } else {
                setEditingValue(fieldValue);
            }
        }
    };

    const handleUpdateRow = async () => {
        console.log("handleUpdateRow()");
        if (editingRow && jobDetails) {
            console.log("handleUpdateRow: editingRow:", editingRow);
            console.log("handleUpdateRow: editingValue:", editingValue);
            let valueToSend;
            if (isDateField(editingRow)) {
                valueToSend = editingDateValue;
                console.log("handleUpdateRow: editingDateValue:", editingDateValue);
                console.log("handleUpdateRow: valueToSend:", valueToSend);
            }
            else {
                valueToSend = editingValue;
                console.log("handleUpdateRow: valueToSend:", valueToSend);
            }
            console.log("Launching patchJobDetails(", jobDetails.job_id, editingRow, valueToSend, ")");
            await patchJobDetails(jobDetails.job_id, editingRow, valueToSend);
            setEditingRow(null);
            setEditingValue('');
            setEditingDateValue(''); // Reset editing date value as well
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

            if (isDateField(editingRow)) {
                // If it's a date field, format the original value and update editingDateValue
                const formattedDate = originalValue ? formatDateToDDMMYYYY(originalValue) : '';
                setEditingDateValue(formattedDate);
            } else {
                // For non-date fields, update editingValue as before
                setEditingValue(originalValue ?? '');
            }
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


    console.log('AppController:handleDateChange type:', typeof handleDateChange); // Should log 'function'
    // Log AppController props
    // console.log('AppController:props:', { props });


    return (
        <>
            <App
                jobs={jobs}
                jobDetails={jobDetails}
                onFetchData={handleFetchData}
                jobsFetched={jobsFetched}
                onFilterClick={handleFilterClick}
                searchTerms={searchTerms}
                showSearchTerms={showSearchTerms}
                selectedTerms={selectedTerms}
                handleToggleTerm={handleToggleTerm}
                onJobClick={handleJobClick}
                onRowClick={handleRowClick}
                editingRow={editingRow}
                editingValue={editingValue}
                onEditValueChange={setEditingValue}
                onUpdateRow={handleSaveWithConfirmation}
                selectedJobId={selectedJobId}
                currentJobs={currentJobs}
                handleCurrentJobsChange={handleCurrentJobsChange}
                appliedJobs={appliedJobs}
                handleAppliedJobsChange={handleAppliedJobsChange}
                handleDateChange={handleDateChange}
                editingDateValue={editingDateValue}
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
