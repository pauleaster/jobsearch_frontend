// src/view/components/FetchButtons.js
import React from 'react';

const FetchButtons = ({ jobsFetched, onFilterClick, showSearchTerms }) => {
    return (
        <div className="fetch-buttons-container">
            {jobsFetched &&
                <button className={`filter-button ${showSearchTerms ? 'is-active' : ''}`}
                    onClick={onFilterClick}
                >
                    {showSearchTerms ? 'Hide Filters' : 'Filter Jobs'}
                </button>
            }
        </div>
    );
};

export default FetchButtons;
