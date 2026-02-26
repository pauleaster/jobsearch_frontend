// src/view/components/SearchTerms.js
import React from 'react';

const SearchTerms = ({ searchTerms, selectedTerms = new Set(), onToggleTerm, isShown }) => {
    // console.log("SearchTerms(", "\nsearchTerms=",searchTerms, "\nselectedTerms=", selectedTerms, "\nonToggleTerm=", onToggleTerm, ")");
    // console.log("SearchTerms: onToggleTerm type:", typeof onToggleTerm);
    // console.log("SearchTerms: isShown:", isShown);

    let bad_result = false;
    // Check if onToggleTerm is a function
    if (typeof onToggleTerm !== 'function') {
        // console.log("Error: onToggleTerm is not a function");
        bad_result = true; // Return null or some error message component
    }

    if (!searchTerms || searchTerms.length === 0) {
        // console.log("SearchTerms: no content");
        bad_result = true; // Or return some placeholder like <div>Loading...</div>
    }
    if (bad_result) {
        return null;
    }
    // console.log("SearchTerms: has content, returning the table");

    // Mapping the search terms to table rows
    const searchTermRows = () => {
        // console.log("SearchTerms: searchTermRows()");
        return searchTerms.map((termObj) => {
            // console.log("SearchTerms: searchTermRows.map(", termObj, ")");
            return (
                <tr 
                    key={termObj.Id}
                    className={selectedTerms.has(termObj.Term) ? 'selected' : ''}
                    onClick={() => onToggleTerm(termObj.Term)}
                >
                    <td>{termObj.Term}</td>
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
