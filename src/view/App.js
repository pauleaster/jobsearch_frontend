import React from 'react';
import './App.css';
import DataTable from './components/DataTable';
import JobDetailsTable from './components/JobDetailsTable';

function App({ jobs, jobDetails, onFetchData, onJobClick }) {
    return (
        <div className="App">
            <header className="App-header">
                <button onClick={onFetchData}>Fetch Jobs</button>
                <DataTable data={jobs} onJobClick={onJobClick} />
                {jobDetails && <JobDetailsTable details={jobDetails} />}
            </header>
        </div>
    );
}

export default App;
