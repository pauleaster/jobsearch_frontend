import React from 'react';
import './App.css';
import DataTable from './components/DataTable';
import JobDetailsTable from './components/JobDetailsTable';
import FetchButtons from './components/FetchButtons';

const App = ({ jobs, jobDetails, onFetchData, jobsFetched, onFilterClick, onJobClick, onRowClick, editingRow, editingValue, onEditValueChange, onUpdateRow }) => {
    return (
        <div className="App">
            <header className="App-header">
                <FetchButtons 
                    onFetchData={onFetchData} 
                    jobsFetched={jobsFetched}
                    onFilterClick={onFilterClick} 
                />
                <DataTable 
                    data={jobs} 
                    onJobClick={onJobClick} 
                />
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
