// src/view/components/SearchTerms.js
import React from 'react';


const SearchTerms = ({ terms }) => {
    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Search Terms</th>
                    </tr>
                </thead>
                <tbody>
                    {terms.map((term, index) => (
                        <tr key={index}>
                            <td>{term}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SearchTerms;
