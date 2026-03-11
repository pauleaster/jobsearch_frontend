import React from 'react';
import './App.css';
import DataTable from './components/DataTable';
import FetchButtons from './components/FetchButtons';
import {FilterTags} from './components/SearchTerms';
import JobTypeControl from './components/JobTypeControl';
console.log('FilterTags component:', FilterTags); // Debugging log  

const App = ({
    jobs,
    jobDetailsMap,
    jobsFetched,
    onFilterClick,
    searchTerms,
    showSearchTerms,
    selectedTerms,
    handleToggleTerm,
    handleBackgroundClick,
    onRowClick,
    selectedJobId,
    onSelectRow,
    editingRow,
    editingValue,
    onEditValueChange,
    onUpdateRow,
    currentJob,
    handleCurrentJobChange,
    appliedJob,
    handleAppliedJobChange,
    handleDateChange,
    editingDateValue,
    page,
    setPage,
    remoteJob,
    handleRemoteJobChange,
    followUpSelectionMode,
    handleFollowUpSelectionModeChange,
    totalCount,
    pageSize,
    totalPages,
    hasNext,
    handleHeaderOnClick,
    activeSort,

}) => {


    return (
        <div className="App">
            <header className="App-header"
                onClick={handleBackgroundClick}
            >
                <div className="top-controls">
                    <FetchButtons
                        jobsFetched={jobsFetched}
                        onFilterClick={onFilterClick}
                        showSearchTerms={showSearchTerms}
                    />
                    <JobTypeControl
                        jobTypeLabel="Current Jobs"
                        jobTypeValue={currentJob}
                        setJobTypeValue={handleCurrentJobChange}
                        enableLabelText="Exclude expired"
                        trueLabelText="Show unknown expiry"
                    />
                    <JobTypeControl
                        jobTypeLabel="Applied Jobs"
                        jobTypeValue={appliedJob}
                        setJobTypeValue={handleAppliedJobChange}
                    />
                    <JobTypeControl
                        jobTypeLabel="Remote Jobs"
                        jobTypeValue={remoteJob}
                        setJobTypeValue={handleRemoteJobChange}
                    />
                    <JobTypeControl
                        jobTypeLabel="Exclude No Follow Up Jobs"
                        jobTypeValue={followUpSelectionMode}
                        setJobTypeValue={handleFollowUpSelectionModeChange}
                        trueLabelText="Yes only"
                    />
                </div>
                <div className='search-terms-datatable-pagination-container'>
                    {showSearchTerms && (
                        <div className="filter-tags-container">
                            <FilterTags
                                filterTags={searchTerms}
                                selectedTerms={selectedTerms}
                                onToggleTerm={handleToggleTerm}
                            />
                        </div>
                    )}




                    <DataTable
                        data={jobs}
                        jobDetailsMap={jobDetailsMap}
                        onRowClick={onRowClick}
                        selectedJobId={selectedJobId}
                        onSelectRow={onSelectRow}
                        editingRow={editingRow}
                        editingValue={editingValue}
                        onEditValueChange={onEditValueChange}
                        onUpdateRow={onUpdateRow}
                        onEditDateChange={handleDateChange}
                        editingDateValue={editingDateValue}
                        handleHeaderOnClick={handleHeaderOnClick}
                        activeSort={activeSort}
                    />
                    <div className="pagination-controls" style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                        <span style={{ margin: '0 1rem' }}>
                            Page {page + 1} of {totalPages} total
                            <span className='total-count'>
                                {' '}({totalCount} jobs total)
                            </span>
                        </span>
                        <button
                            disabled={!hasNext}
                            onClick={() => setPage(page + 1)}>
                            Next
                        </button>
                    </div>
                </div>


            </header>
        </div>
    );
}

export default App;
