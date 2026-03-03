// src/view/components/SearchTerms.js
import React from 'react';

function chunkArray(array, columns) {
    const result = [];
    for (let i = 0; i < array.length; i += columns) {
        result.push(array.slice(i, i + columns));
    }
    return result;
}

const SearchTerms = ({ searchTerms, selectedTerms = new Set(), onToggleTerm, isShown, columns = 5 }) => {
    if (!Array.isArray(searchTerms) || searchTerms.length === 0 || typeof onToggleTerm !== 'function') {
        return null;
    }

    const rows = chunkArray(searchTerms, columns);

    return (
        <table className="table-container">
            <tbody>
                {rows.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                        {row.map((termObj) => (
                            <td
                                key={termObj.Id}
                                className={selectedTerms.has(termObj.Term) ? 'selected' : ''}
                                onClick={() => onToggleTerm(termObj.Term)}
                                style={{ cursor: 'pointer', textAlign: 'center' }}
                            >
                                {termObj.Term}
                            </td>
                        ))}
                        {/* Fill empty cells if needed */}
                        {Array.from({ length: columns - row.length }).map((_, i) => (
                            <td key={`empty-${i}`} />
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SearchTerms;
