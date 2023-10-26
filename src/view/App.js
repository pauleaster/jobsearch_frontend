import React from 'react';
import './App.css';
import DataTable from './components/DataTable';
import JobDetailsTable from './components/JobDetailsTable';

const App = ({ jobs, jobDetails, onFetchData, onJobClick, onRowClick, editingRow, editingValue, onEditValueChange, onUpdateRow }) => {
    return (
        <div className="App">
            <header className="App-header">
                <button onClick={onFetchData}>Fetch Jobs</button>
                <DataTable data={jobs} onJobClick={onJobClick} />
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
