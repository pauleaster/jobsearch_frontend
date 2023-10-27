// src/view/components/FetchButtons.js
import React from 'react';

const FetchButtons = ({ onFetchData, jobsFetched }) => {
    return (
        <div className="fetch-buttons-container">
            <button onClick={onFetchData}>Fetch Jobs</button>
            {jobsFetched && <button>Filter Jobs</button>}
        </div>
    );
};

export default FetchButtons;
