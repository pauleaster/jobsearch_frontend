// src/view/components/SearchTerms.js
import React from 'react';

const SearchTerms = ({ searchTerms, selectedTerms = new Set(), onToggleTerm, isShown }) => {
    console.log("SearchTerms(", "\nsearchTerms=",searchTerms, "\nselectedTerms=", selectedTerms, "\nonToggleTerm=", onToggleTerm, ")");
    console.log("SearchTerms: onToggleTerm type:", typeof onToggleTerm);
    console.log("SearchTerms: isShown:", isShown);

    let bad_result = false;
    // Check if onToggleTerm is a function
    if (typeof onToggleTerm !== 'function') {
        console.log("Error: onToggleTerm is not a function");
        bad_result = true; // Return null or some error message component
    }

    if (!searchTerms || searchTerms.length === 0) {
        console.log("SearchTerms: no content");
        bad_result = true; // Or return some placeholder like <div>Loading...</div>
    }
    if (bad_result) {
        return null;
    }
    console.log("SearchTerms: has content, returning the table");

    // Mapping the search terms to table rows
    const searchTermRows = () => {
        // console.log("SearchTerms: searchTermRows()");
        return searchTerms.map((term) => {
            // console.log("SearchTerms: searchTermRows.map(", term, ")");
            return (
                <tr 
                    key={term} 
                    className={selectedTerms.has(term) ? 'selected' : ''}
                    onClick={() => onToggleTerm(term)}
                >
                    <td>{term}</td>
                </tr>
            );
        });
    };

    
    return (
        <table className="table-container">
            <thead>
                <tr>
                    <th>Search Terms</th>
                </tr>
            </thead>
            <tbody>
                {searchTermRows()}
            </tbody>
        </table>
    );
};

export default SearchTerms;
