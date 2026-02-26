import React from 'react';
import './App.css';
import DataTable from './components/DataTable';
import JobDetailsTable from './components/JobDetailsTable';
import FetchButtons from './components/FetchButtons';
import SearchTerms from './components/SearchTerms';
import JobTypeControl from './components/JobTypeControl';

const App = ({
    jobs,
    jobDetails,
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
    editingDateValue

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
                            onJobClick={onJobClick}
                            selectedJobId={selectedJobId}
                        />
                    </div>
                </div>
                {jobDetails && (
                    <JobDetailsTable
                        details={jobDetails}
                        onRowClick={onRowClick}
                        editingRow={editingRow}
                        editingValue={editingValue}
                        onEditValueChange={onEditValueChange}
                        onUpdateRow={onUpdateRow}
                        // onEditDateChange={() => console.log("Static test")}
                        onEditDateChange={handleDateChange}
                    />
                )}
            </header>
        </div>
    );
}

export default App;
