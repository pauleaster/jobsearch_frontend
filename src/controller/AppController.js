// src>controller>AppController.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    fetchValidJobsAndSearchTerms,
    fetchFilteredValidJobsAndSearchTerms,
    fetchSearchTerms,
    fetchJobDetails,
    patchJobDetails
} from '../model/api';
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
    const [currentJob, setCurrentJob] = useState(null); // singular per OpenAPI
    const [appliedJob, setAppliedJob] = useState(null); // singular per OpenAPI

    // Define handleDateChange within AppController.js
    const handleDateChange = (event) => {
        try {
            const dateInDDMMYYYY = event.target.value;
            // console.log("handleDateChange(", dateInDDMMYYYY, ")");
            // Assuming convertDDMMYYYYToISO function exists and does the conversion
            const dateInISO = convertDDMMYYYYToISO(dateInDDMMYYYY);
            // console.log("handleDateChange: dateInISO:", dateInISO);
            // console.log("handleDateChange: setEditingDateValue(", dateInISO, ")");
            setEditingDateValue(dateInISO);
        } catch (error) {
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
            console.log("handleFilterClick: fetchedSearchTerms:", fetchedSearchTerms);
            // Store only the Term values in selectedTerms set
            const seachTermsSet = new Set(fetchedSearchTerms.map(termObj => termObj.Term));
            console.log("handleFilterClick: seachTermsSet:", seachTermsSet);
            setSelectedTerms(seachTermsSet);
            console.log("handleFilterClick: selectedTerms after setSelectedTerms:", selectedTerms);
            setShowSearchTerms(true); // Show the search terms table
            console.log("handleFilterClick: showSearchTerms set to true");
        }
        else {
            console.log("handleFilterClick: fetchSearchTerms returned null");
        }
    };

    const handleFilteredFetchData = useCallback(async (selectedTermsSet) => {
        // OpenAPI expects filterTerms, currentJob, appliedJob (all singular)
        const toggledSelectedTerms = Array.from(selectedTermsSet);
        // console.log("handleFilteredFetchData: toggledSelectedTerms:", toggledSelectedTerms);
        // console.log("handleFilteredFetchData(currentJob, appliedJob):", currentJob, appliedJob);
        const data = await fetchFilteredValidJobsAndSearchTerms(
            toggledSelectedTerms,
            currentJob,
            appliedJob
        );
        setJobs(data);
        setJobsFetched(true);  // Set to true once data is fetched
    }, [currentJob, appliedJob]);


    const handleToggleTerm = (term) => {
        const newSelectedTerms = new Set(selectedTerms);
        if (newSelectedTerms.has(term)) {
            if (newSelectedTerms.size > 1) {
                newSelectedTerms.delete(term);
                // console.log("handleToggleTerm: newSelectedTerms.delete(", term, ")");
            } else {
                return;
            }
        } else {
            newSelectedTerms.add(term);
            // console.log("handleToggleTerm: newSelectedTerms.add(", term, ")");
        }
        setSelectedTerms(newSelectedTerms); // update state
        // launch handleFetchData with the selected terms, converting to an array first
        handleFilteredFetchData(newSelectedTerms);
    };

    useEffect(() => {
        // console.log("AppController: showSearchTerms changed:", showSearchTerms);
        // console.log("AppController: handleToggleTerm type:", typeof handleToggleTerm); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSearchTerms]);

    // console.log("AppController: handleToggleTerm type:", typeof handleToggleTerm); // Should log 'function'

    const handleJobClick = async (jobId) => {
        // console.log("handleJobClick(", jobId, ")");
        const details = await fetchJobDetails(jobId);
        // console.log("handleJobClick: details:", details);
        setJobDetails(details);
        setSelectedJobId(jobId); // Update the selected job ID
    };

    const handleRowClick = (label) => {
        // console.log("handleRowClick(", label, ")");
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

    useEffect(() => {
        // Reset editing state when jobDetails changes (new job selected)
        setEditingRow(null);
        setEditingValue('');
        setEditingDateValue('');
    }, [jobDetails]);

    const handleBackgroundClick = (e) => {
        // Only reset if the click is on the background (App or App-header)
        if (
            e.target.className === "App" ||
            e.target.className === "App-header"
        ) {
            setEditingRow(null);
            setEditingValue('');
            setEditingDateValue('');
        }
    };


    const handleUpdateRow = async () => {
        // console.log("handleUpdateRow()");
        if (editingRow && jobDetails) {
            // console.log("handleUpdateRow: editingRow:", editingRow);
            // console.log("handleUpdateRow: editingValue:", editingValue);
            let valueToSend;
            if (isDateField(editingRow)) {
                valueToSend = editingDateValue;
                // console.log("handleUpdateRow: editingDateValue:", editingDateValue);
                // console.log("handleUpdateRow: valueToSend:", valueToSend);
            }
            else {
                valueToSend = editingValue;
                // console.log("handleUpdateRow: valueToSend:", valueToSend);
            }
            // console.log("Launching patchJobDetails(", jobDetails.job_id, editingRow, valueToSend, ")");
            await patchJobDetails(jobDetails.job_id, editingRow, valueToSend);
            setEditingRow(null);
            setEditingValue('');
            setEditingDateValue('');
            handleJobClick(jobDetails.Id);
        }
    };

    const handleSaveWithConfirmation = async () => {
        setIsModalOpen(true);
    };

    const handleConfirmSave = async () => {
        await handleUpdateRow();
        const updatedJobDetails = await fetchJobDetails(jobDetails.Id);
        setJobDetails(updatedJobDetails);
        setIsModalOpen(false);
    };

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
        handleFilteredFetchData(selectedTerms);
    }, [currentJob, appliedJob, selectedTerms, handleFilteredFetchData]);

    const handleCurrentJobChange = (newValue) => {
        setCurrentJob(newValue);
    };

    const handleAppliedJobChange = (newValue) => {
        setAppliedJob(newValue);
    };


    // console.log('AppController:handleDateChange type:', typeof handleDateChange); // Should log 'function'
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
                handleBackgroundClick={handleBackgroundClick}
                onRowClick={handleRowClick}
                editingRow={editingRow}
                editingValue={editingValue}
                onEditValueChange={setEditingValue}
                onUpdateRow={handleSaveWithConfirmation}
                selectedJobId={selectedJobId}
                currentJob={currentJob}
                handleCurrentJobChange={handleCurrentJobChange}
                appliedJob={appliedJob}
                handleAppliedJobChange={handleAppliedJobChange}
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
};

export default AppController;
