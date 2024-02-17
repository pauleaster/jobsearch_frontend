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
    onRowClick, 
    editingRow, 
    editingValue, 
    onEditValueChange, 
    onUpdateRow,
    selectedJobId,
    currentJobs,
    handleCurrentJobsChange,
    appliedJobs,
    handleAppliedJobsChange
}) => {
    return (
        <div className="App">
            <header className="App-header">
                <FetchButtons 
                    onFetchData={onFetchData} 
                    jobsFetched={jobsFetched}
                    onFilterClick={onFilterClick} 
                />
                 <JobTypeControl
                    jobTypeLabel="Current Jobs"
                    jobTypeValue={currentJobs}
                    setJobTypeValue={handleCurrentJobsChange}
                />
                <JobTypeControl
                    jobTypeLabel="Applied Jobs"
                    jobTypeValue={appliedJobs}
                    setJobTypeValue={handleAppliedJobsChange}
                />
                <div className="app-content">
                    {showSearchTerms && (
                        <div className="search-terms-container">
                            <SearchTerms 
                                searchTerms={searchTerms} 
                                selectedTerms={selectedTerms} 
                                onToggleTerm={handleToggleTerm}
                                isShown={showSearchTerms}  />
                        </div>
                    )}
                    <div className='table-container'>
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
                        />
                )}
            </header>
        </div>
    );
}

export default App;
