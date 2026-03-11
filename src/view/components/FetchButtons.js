// src/view/components/FetchButtons.js
import React from 'react';

const FetchButtons = ({ jobsFetched, onFilterClick }) => {
    return (
        <div className="fetch-buttons-container">
            {jobsFetched && <button onClick={onFilterClick}>Filter Jobs</button>}
        </div>
    );
};

export default FetchButtons;
