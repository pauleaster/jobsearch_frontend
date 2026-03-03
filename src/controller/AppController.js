// src>controller>AppController.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    fetchCombinedJobsAndSearchTerms,
    fetchSearchTerms,
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
    const [currentJob, setCurrentJob] = useState(null); // singular per OpenAPI
    const [appliedJob, setAppliedJob] = useState(null); // singular per OpenAPI
    const [remoteJob, setRemoteJob] = useState(null);
    const [jobDetailsMap, setJobDetailsMap] = useState({});
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [effectivePageSize, setEffectivePageSize] = useState(100);

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
        if (showSearchTerms) {
            setShowSearchTerms(false);
            return;
        }
        const fetchedSearchTerms = await fetchSearchTerms();
        if (fetchedSearchTerms) {
            setSearchTerms(fetchedSearchTerms);
            const seachTermsSet = new Set(fetchedSearchTerms.map(termObj => termObj.Term));
            setSelectedTerms(seachTermsSet);
            setShowSearchTerms(true); // Show the search terms table
        } else {
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
        const toggledSelectedTerms = Array.from(selectedTermsSet);
        const skip = (pageOverride !== null ? pageOverride : page) * pageSize;

        const payload = {
            filterTerms: toggledSelectedTerms,
            currentJob,
            appliedJob,
            remoteJob,
            skip,
            limit: pageSize
        };

        const result = await fetchCombinedJobsAndSearchTerms(payload);
        const rows = result?.rows ?? [];
        const count = result?.totalCount ?? 0;
        const size = result?.pageSize || payload.limit || 100;

        setJobs(rows);
        setTotalCount(count);
        setEffectivePageSize(size);

        const { detailsMap, fieldMappingMap } = buildJobDetailsAndFieldMapping(rows);
        setJobDetailsMap(detailsMap);
        setJobFieldMapping(fieldMappingMap);

        setJobsFetched(true);  // Set to true once data is fetched
    }, [currentJob, appliedJob, remoteJob, page]);

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
        console.log("handleToggleTerm: newSelectedTerms:", newSelectedTerms);
        console.log("newSelectedTerms updated now waiting for useEffect to trigger handleFilteredFetchData with newSelectedTerms");
    };

    useEffect(() => {
        // console.log("AppController: showSearchTerms changed:", showSearchTerms);
        // console.log("AppController: handleToggleTerm type:", typeof handleToggleTerm); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSearchTerms]);

    // console.log("AppController: handleToggleTerm type:", typeof handleToggleTerm); // Should log 'function'


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
    }, [currentJob, appliedJob, remoteJob, selectedTerms, handleFilteredFetchData]);

    const handleCurrentJobChange = (newValue) => {
        setCurrentJob(newValue);
    };

    const handleAppliedJobChange = (newValue) => {
        setAppliedJob(newValue);
    };

    const handleRemoteJobChange = (newValue) => {
        setRemoteJob(newValue);
    };

    const handleUpdateRow = async () => {
        if (editingRow && jobDetailsMap && jobFieldMapping) {
            const { jobId, fieldLabel } = editingRow;
            let valueToSend;
            if (isDateField(fieldLabel)) {
                valueToSend = editingDateValue;
            } else {
                valueToSend = editingValue;
            }
            // Use the mapping to get the backend field name
            const mapping = jobFieldMapping[jobId] || {};
            const backendField = mapping[createLowercaseDBField(fieldLabel)] || fieldLabel;
            await patchJobDetails(jobId, backendField, valueToSend);
            setEditingRow(null);
            setEditingValue('');
            setEditingDateValue('');
            // Optionally refresh data here, e.g.:
            await handleFilteredFetchData(selectedTerms);
        }
    };

    const handleConfirmSave = async () => {
        await handleUpdateRow(); // This should use editingRow, editingValue, etc.
        // Optionally refresh data here, e.g.:
        // await handleFilteredFetchData(selectedTerms);
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Optionally reset editing state:
        // setEditingRow(null);
        // setEditingValue('');
        // setEditingDateValue('');
    };

    // console.log('AppController:handleDateChange type:', typeof handleDateChange); // Should log 'function'
    // Log AppController props
    // console.log('AppController:props:', { props });

    useEffect(() => {
        console.log("editingRow changed:", editingRow);
    }, [editingRow]);

    const totalPages = Math.max(1, Math.ceil((totalCount || 0) / (pageSize || 1)));
    const hasNext = page + 1 < totalPages;

    const [activeSort, setActiveSort] = useState({
        column: null,      // e.g. "Job Number" or null
        direction: null    // "up" | "down" | null
    });

    const handleHeaderOnClick = (fieldLabel) => {
        setActiveSort(prev => {
            if (prev.column !== fieldLabel) {
                console.log("handleHeaderOnClick: prev.column =", prev.column, "fieldLabel:", fieldLabel);
                console.log("handleHeaderOnClick: setting activeSort to:", { column: fieldLabel, direction: "up" });
                return { column: fieldLabel, direction: "up" };
            }
            if (prev.direction === "up") {
                console.log("handleHeaderOnClick: prev.direction was 'up', now setting to 'down' for column:", fieldLabel);
                return {
                    column: fieldLabel, direction: "down"
                };
            };
            if (prev.direction === "down") {
                console.log("handleHeaderOnClick: prev.direction was 'down', now resetting for column:", fieldLabel);
                return { column: null, direction: null };
            };
            return { column: fieldLabel, direction: "up" };
        });
    };


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
                handleBackgroundClick={handleBackgroundClick}
                onRowClick={handleRowClick}
                editingRow={editingRow}
                editingValue={editingValue}
                onEditValueChange={setEditingValue}
                onUpdateRow={handleSaveWithConfirmation}
                currentJob={currentJob}
                handleCurrentJobChange={handleCurrentJobChange}
                appliedJob={appliedJob}
                handleAppliedJobChange={handleAppliedJobChange}
                handleDateChange={handleDateChange}
                editingDateValue={editingDateValue}
                page={page}
                setPage={setPage}
                remoteJob={remoteJob}
                handleRemoteJobChange={handleRemoteJobChange}
                totalCount={totalCount}
                pageSize={effectivePageSize}
                totalPages={totalPages}
                hasNext={hasNext}
                handleHeaderOnClick={handleHeaderOnClick}
                activeSort={activeSort}
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
