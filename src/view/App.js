import React from 'react';
import './App.css';
import DataTable from './components/DataTable';
import DataTableOld from './components/DataTableOld';
import JobDetailsTable from './components/JobDetailsTable';
import FetchButtons from './components/FetchButtons';
import SearchTerms from './components/SearchTerms';
import JobTypeControl from './components/JobTypeControl';


const App = ({
    jobs,
    jobDetails,
    jobDetailsMap,
    onFetchData,
    jobsFetched,
    onFilterClick,
    searchTerms,
    showSearchTerms,
    selectedTerms,
    handleToggleTerm,
    onJobClick,
    handleBackgroundClick,
    onRowClick,
    editingRow,
    editingValue,
    onEditValueChange,
    onUpdateRow,
    selectedJobId,
    currentJob,
    handleCurrentJobChange,
    appliedJob,
    handleAppliedJobChange,
    handleDateChange,
    editingDateValue,
    page,
    setPage,

}) => {
    return (
        <div className="App">
            <header className="App-header"
                onClick={handleBackgroundClick}
            >
                <FetchButtons
                    onFetchData={onFetchData}
                    jobsFetched={jobsFetched}
                    onFilterClick={onFilterClick}
                />
                <JobTypeControl
                    jobTypeLabel="Current Jobs"
                    jobTypeValue={currentJob}
                    setJobTypeValue={handleCurrentJobChange}
                />
                <JobTypeControl
                    jobTypeLabel="Applied Jobs"
                    jobTypeValue={appliedJob}
                    setJobTypeValue={handleAppliedJobChange}
                />

                <div className="job-search-data">

                    {showSearchTerms && (
                        <div className="search-terms-container">
                            <SearchTerms
                                searchTerms={searchTerms}
                                selectedTerms={selectedTerms}
                                onToggleTerm={handleToggleTerm}
                                isShown={showSearchTerms} />
                        </div>
                    )}
                    <div className='table-container-1'>
                        <DataTable
                            data={jobs}
                            jobDetailsMap={jobDetailsMap}
                            onJobClick={onJobClick}
                            selectedJobId={selectedJobId}
                            onRowClick={onRowClick}
                            editingRow={editingRow}
                            editingValue={editingValue}
                            onEditValueChange={onEditValueChange}
                            onUpdateRow={onUpdateRow}
                            onEditDateChange={handleDateChange}
                            editingDateValue={editingDateValue}
                        />
                        <div className="pagination-controls" style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <button disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
                            <span style={{ margin: '0 1rem' }}>Page {page + 1}</span>
                            <button onClick={() => setPage(page + 1)}>Next</button>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default App;
