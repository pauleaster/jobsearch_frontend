// src/view/components/SearchTerms.js
import React from 'react';


const SearchTerms = ({ searchTerms, selectedTerms, onToggleTerm }) => {
    console.log("SearchTerms(", searchTerms, selectedTerms, onToggleTerm, ")");
    if (!searchTerms || searchTerms.length === 0) {
        return null; // Or return some placeholder like <div>Loading...</div>
    }
    return (
        <table className="table-container">
            <thead>
                <tr>
                    <th>Search Terms</th>
                </tr>
            </thead>
            <tbody>
                {searchTerms.map((term, index) => (
                    <tr 
                        key={index} 
                        className={selectedTerms.has(term) ? 'selected' : ''}
                        onClick={() => onToggleTerm(term)}
                    >
                        <td>{term}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SearchTerms;
