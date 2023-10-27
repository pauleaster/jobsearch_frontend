import React from 'react';
import './App.css';
import DataTable from './components/DataTable';
import JobDetailsTable from './components/JobDetailsTable';
import FetchButtons from './components/FetchButtons';
import SearchTerms from './components/SearchTerms';

const App = ({ 
    jobs, 
    jobDetails, 
    onFetchData, 
    jobsFetched, 
    onFilterClick,
    searchTerms,
    showSearchTerms, 
    onJobClick, 
    onRowClick, 
    editingRow, 
    editingValue, 
    onEditValueChange, 
    onUpdateRow 
}) => {
    return (
        <div className="App">
            <header className="App-header">
                <FetchButtons 
                    onFetchData={onFetchData} 
                    jobsFetched={jobsFetched}
                    onFilterClick={onFilterClick} 
                />
                <div className="app-content">
                    {showSearchTerms && (
                        <div className="search-terms-container">
                            <SearchTerms 
                                terms={searchTerms} />
                        </div>
                    )}
                    <div className='table-container'>
                        <DataTable 
                            data={jobs} 
                            onJobClick={onJobClick} 
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
