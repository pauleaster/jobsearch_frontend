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
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [currentJob, setCurrentJob] = useState(null); // singular per OpenAPI
    const [appliedJob, setAppliedJob] = useState(null); // singular per OpenAPI
    const [remoteJob, setRemoteJob] = useState(null);
    const [followUpSelectionMode, setFollowUpSelectionMode] = useState(false);
    const [jobDetailsMap, setJobDetailsMap] = useState({});
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [effectivePageSize, setEffectivePageSize] = useState(100);
    const [activeSort, setActiveSort] = useState({
        column: null,      // e.g. "Job Number" or null
        direction: null    // "up" | "down" | null
    });
    const [excludedTerms, setExcludedTerms] = useState(new Set());

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


    const handleFilterClick = async () => {
        if (showSearchTerms) {
            setShowSearchTerms(false);
            return;
        }
        const fetchedSearchTerms = await fetchSearchTerms();
        if (fetchedSearchTerms) {
            setSearchTerms([...fetchedSearchTerms].sort((a, b) => a.Term.localeCompare(b.Term)));
            if (selectedTerms.size === 0) {
                const searchTermsSet = new Set(fetchedSearchTerms.map(termObj => termObj.Term));
                setSelectedTerms(searchTermsSet);
            }
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

    const handleFilteredFetchData = useCallback(
        async (selectedTermsSet, pageOverride = null) => {
            const toggledSelectedTerms = Array.from(selectedTermsSet);
            const skip = (pageOverride !== null ? pageOverride : page) * pageSize;

            // Determine sort mode and fields
            let sortMode = "algorithm";
            let sortBy = null;
            let sortDir = null;
            if (activeSort.column && activeSort.direction) {
                if (activeSort.column === "Matching Terms") {
                    sortMode = "algorithm";
                    sortBy = null;
                } else {
                    sortMode = "column";
                    sortBy = createLowercaseDBField(activeSort.column); // convert to backend field name
                    sortDir = activeSort.direction === "up" ? "asc" : "desc";
                }
            }

            const payload = {
                filterTerms: toggledSelectedTerms,
                excludedSearchTerms: Array.from(excludedTerms),
                currentJob,
                appliedJob,
                remoteJob,
                followUpSelectionMode,
                skip,
                limit: pageSize,
                sortMode,
                sortBy,
                sortDir,
            };

            const result = await fetchCombinedJobsAndSearchTerms(payload);
            const rows = (result?.rows ?? []).map(job =>
                Array.isArray(job.search_terms)
                    ? { ...job, search_terms: [...job.search_terms].sort((a, b) => a.localeCompare(b)) }
                    : job
            );
            const count = result?.totalCount ?? 0;
            const size = result?.pageSize || payload.limit || 100;

            setJobs(rows);
            setTotalCount(count);
            setEffectivePageSize(size);

            const { detailsMap, fieldMappingMap } = buildJobDetailsAndFieldMapping(rows);
            setJobDetailsMap(detailsMap);
            setJobFieldMapping(fieldMappingMap);

            setJobsFetched(true);  // Set to true once data is fetched
        },
        [currentJob, appliedJob, remoteJob, followUpSelectionMode, page, activeSort, excludedTerms] // <-- add activeSort and excludedTerms as dependencies
    );

    const handleToggleTerm = (term) => {
        const newSelectedTerms = new Set(selectedTerms);
        if (newSelectedTerms.has(term)) {
            if (newSelectedTerms.size > 1) {
                newSelectedTerms.delete(term);
            } else {
                return;
            }
        } else {
            newSelectedTerms.add(term);
            // Remove from excluded if present
            if (excludedTerms.has(term)) {
                const newExcludedTerms = new Set(excludedTerms);
                newExcludedTerms.delete(term);
                setExcludedTerms(newExcludedTerms);
            }
        }
        setSelectedTerms(newSelectedTerms);
    };

    const handleToggleExcludedTerm = (term) => {
        const newExcludedTerms = new Set(excludedTerms);
        if (newExcludedTerms.has(term)) {
            newExcludedTerms.delete(term);
        } else {
            // Only exclude (and remove from included) if it won't empty the included set
            if (selectedTerms.has(term)) {
                if (selectedTerms.size > 1) {
                    const newSelectedTerms = new Set(selectedTerms);
                    newSelectedTerms.delete(term);
                    setSelectedTerms(newSelectedTerms);
                    newExcludedTerms.add(term);
                }
                // else: can't exclude the last included term — do nothing
            } else {
                newExcludedTerms.add(term);
            }
        }
        setExcludedTerms(newExcludedTerms);
    };

    useEffect(() => {
        // console.log("AppController: showSearchTerms changed:", showSearchTerms);
        // console.log("AppController: handleToggleTerm type:", typeof handleToggleTerm); 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showSearchTerms]);

    // console.log("AppController: handleToggleTerm type:", typeof handleToggleTerm); // Should log 'function'


    const handleRowClick = ({ jobId, fieldLabel }) => {
        console.log("handleRowClick(", jobId, fieldLabel, ")");
        setSelectedJobId(jobId);
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

    const hasDataChanged = () => {
        if (!editingRow || !jobDetailsMap) {
            return false;
        }

        const { jobId, fieldLabel } = editingRow;
        const dbField = createLowercaseDBField(fieldLabel);
        const originalValue = jobDetailsMap[jobId]?.[dbField] ?? '';

        if (isDateField(fieldLabel)) {
            const currentDateValue = editingDateValue ?? '';
            const originalDisplayValue = originalValue
                ? formatDateToDDMMYYYY(originalValue)
                : '';

            return currentDateValue !== originalValue && currentDateValue !== originalDisplayValue;
        }

        return (editingValue ?? '') !== originalValue;
    };

    const handleSaveWithConfirmation = async () => {
        if (!hasDataChanged()) {
            setEditingRow(null);
            setEditingValue('');
            setEditingDateValue('');
            return;
        }

        setIsModalOpen(true);
    };



    useEffect(() => {
        handleFilteredFetchData(selectedTerms);
    }, [currentJob, appliedJob, remoteJob, followUpSelectionMode, selectedTerms, excludedTerms, handleFilteredFetchData, activeSort]);

    const handleCurrentJobChange = (newValue) => {
        setCurrentJob(newValue);
    };

    const handleAppliedJobChange = (newValue) => {
        setAppliedJob(newValue);
    };

    const handleRemoteJobChange = (newValue) => {
        setRemoteJob(newValue);
    };

    const handleFollowUpSelectionModeChange = (newValue) => {
        setFollowUpSelectionMode(newValue);
    }

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
        if (!hasDataChanged()) {
            setIsModalOpen(false);
            setEditingRow(null);
            setEditingValue('');
            setEditingDateValue('');
            return;
        }

        await handleUpdateRow();
        setIsModalOpen(false);
        setEditingRow(null);
        setEditingValue('');
        setEditingDateValue('');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRow(null);
        setEditingValue('');
        setEditingDateValue('');
    };

    const handleRequestCloseModal = () => {
        // Overlay click / ESC: only close when nothing has changed
        if (!hasDataChanged()) {
            setIsModalOpen(false);
        }
        // else: keep modal open until explicit Yes/No
    };

    // console.log('AppController:handleDateChange type:', typeof handleDateChange); // Should log 'function'
    // Log AppController props
    // console.log('AppController:props:', { props });

    useEffect(() => {
        console.log("editingRow changed:", editingRow);
    }, [editingRow]);

    const totalPages = Math.max(1, Math.ceil((totalCount || 0) / (pageSize || 1)));
    const hasNext = page + 1 < totalPages;



    const handleHeaderOnClick = (fieldLabel) => {
        if (fieldLabel === "Matching Terms") {
            // Always set to down, never toggle
            setActiveSort({ column: "Matching Terms", direction: "down" });
            return;
        }
        setActiveSort(prev => {
            // If switching from Matching Terms to another column, reset first
            if (prev.column !== fieldLabel) {
                return { column: fieldLabel, direction: "up" };
            }
            if (prev.direction === "up") {
                return { column: fieldLabel, direction: "down" };
            }
            if (prev.direction === "down") {
                return { column: null, direction: null };
            }
            return { column: fieldLabel, direction: "up" };
        });
    };

    useEffect(() => {
        if (page !== 0) setPage(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTerms, excludedTerms, currentJob, appliedJob, remoteJob, activeSort]);


    return (
        <>
            <App
                jobs={jobs}
                jobDetailsMap={jobDetailsMap}
                jobsFetched={jobsFetched}
                onFilterClick={handleFilterClick}
                searchTerms={searchTerms}
                showSearchTerms={showSearchTerms}
                selectedTerms={selectedTerms}
                handleToggleTerm={handleToggleTerm}
                handleBackgroundClick={handleBackgroundClick}
                onRowClick={handleRowClick}
                selectedJobId={selectedJobId}
                onSelectRow={setSelectedJobId}
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
                followUpSelectionMode={followUpSelectionMode}
                handleFollowUpSelectionModeChange={handleFollowUpSelectionModeChange}
                totalCount={totalCount}
                pageSize={effectivePageSize}
                totalPages={totalPages}
                hasNext={hasNext}
                handleHeaderOnClick={handleHeaderOnClick}
                activeSort={activeSort}
                excludedTerms={excludedTerms}
                handleToggleExcludedTerm={handleToggleExcludedTerm}
            />
            <SaveConfirmationDialog
                isOpen={isModalOpen}
                onConfirm={handleConfirmSave}
                onClose={handleCloseModal}
                onRequestClose={handleRequestCloseModal}
            />
        </>
    );
};

export default AppController;
