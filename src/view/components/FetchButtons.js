// src/view/components/FetchButtons.js
import React from 'react';

const FetchButtons = ({ jobsFetched, onFilterClick, showSearchTerms, filtersLoaded }) => {
    const buttonLabel = showSearchTerms
        ? 'Hide Filters'
        : filtersLoaded
            ? 'Show Filters'
            : 'Filter Jobs';

    return (
        <div className="fetch-buttons-container">
            {jobsFetched &&
                <button className={`filter-button ${showSearchTerms ? 'is-active' : ''}`}
                    onClick={onFilterClick}
                >
                    {buttonLabel}
                </button>
            }
        </div>
    );
};

export default FetchButtons;
