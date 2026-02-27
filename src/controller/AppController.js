// src>controller>AppController.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    fetchCombinedJobsAndSearchTerms,
    fetchSearchTerms,
    fetchJobDetails,
    patchJobDetails
} from '../model/api';
import App from '../view/App';
import { createLowercaseDBField, isDateField, formatDateToDDMMYYYY, convertDDMMYYYYToISO } from '../utils/transform';
import SaveConfirmationDialog from '../view/components/SaveConfirmationDialog';

const AppController = () => {
    const [jobs, setJobs] = useState([]);
    const [jobFieldMapping, setJobFieldMapping] = useState(null);
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
    const [jobDetailsMap, setJobDetailsMap] = useState({});
    const [page, setPage] = useState(0);

    const pageSize = 100;



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

    function buildJobDetailsAndFieldMapping(jobs) {
        const detailsMap = {};
        const fieldMappingMap = {};

        for (const job of jobs) {
            const details = {};
            const mapping = {};

            for (const key of Object.keys(job)) {
                const frontendKey = createLowercaseDBField(key); // e.g., "Job Number" -> "job_number"
                details[frontendKey] = job[key];
                mapping[frontendKey] = key; // for reverse lookup (frontend -> backend)
            }

            detailsMap[job.job_id] = details;
            fieldMappingMap[job.job_id] = mapping;
        }

        return { detailsMap, fieldMappingMap };
    }

    const handleFilteredFetchData = useCallback(async (selectedTermsSet, pageOverride = null) => {
        // OpenAPI expects filterTerms, currentJob, appliedJob (all singular)
        const toggledSelectedTerms = Array.from(selectedTermsSet);
        // console.log("handleFilteredFetchData: toggledSelectedTerms:", toggledSelectedTerms);
        // console.log("handleFilteredFetchData(currentJob, appliedJob):", currentJob, appliedJob);
        const skip = (pageOverride !== null ? pageOverride : page) * pageSize;
        const data = await fetchCombinedJobsAndSearchTerms(
            toggledSelectedTerms,
            currentJob,
            appliedJob,
            skip,
            pageSize
        );
        setJobs(data);

        const { detailsMap, fieldMappingMap } = buildJobDetailsAndFieldMapping(data);
        setJobDetailsMap(detailsMap);
        setJobFieldMapping(fieldMappingMap);

        setJobsFetched(true);  // Set to true once data is fetched
    }, [currentJob, appliedJob, page]);


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
        const { details, mapping } = await fetchJobDetails(jobId);
        setJobDetails(details);
        setJobFieldMapping(mapping);
        setSelectedJobId(jobId);
    };

    const handleRowClick = ({ jobId, fieldLabel }) => {
        console.log("handleRowClick(", jobId, fieldLabel, ")");
        setEditingRow({ jobId, fieldLabel });
        const details = jobDetailsMap[jobId] || {};
        const dbField = createLowercaseDBField(fieldLabel);
        let fieldValue = details[dbField];
        fieldValue = fieldValue ?? ''; // Simplified check for null or undefined
        console.log("Setting editingRow:", { jobId, fieldLabel });
        console.log("Setting editingValue:", fieldValue);

        // Check if the field is a date field
        if (isDateField(fieldLabel)) {
            // Convert the fieldValue to dd/MM/yyyy format before setting
            const formattedDate = fieldValue ? formatDateToDDMMYYYY(fieldValue) : '';
            setEditingDateValue(formattedDate);
            console.log("Setting editingDateValue:", formattedDate);
        } else {
            setEditingValue(fieldValue);
        }
    };


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

    const handleSaveWithConfirmation = async () => {
        setIsModalOpen(true);
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

    useEffect(() => {
        console.log("editingRow changed:", editingRow);
    }, [editingRow]);

    return (
        <>
            <App
                jobs={jobs}
                jobDetailsMap={jobDetailsMap}
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
                page={page}
                setPage={setPage}

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
