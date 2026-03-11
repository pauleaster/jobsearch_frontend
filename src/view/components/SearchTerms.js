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

const FilterTags = ({
    filterTags,
    searchTerms,
    selectedTerms = new Set(),
    onToggleTerm,
}) => {
    const terms = Array.isArray(filterTags) ? filterTags : searchTerms;

    if (!Array.isArray(terms) || terms.length === 0 || typeof onToggleTerm !== 'function') {
        return null;
    }

    return (
        <div className="filter-tags" role="listbox" aria-multiselectable="true">
            {terms.map((termObj, idx) => {
                const term = termObj?.Term;
                if (!term) return null;

                const isSelected = selectedTerms.has(term);

                return (
                    <button
                        key={termObj?.Id ?? `${term}-${idx}`}
                        type="button"
                        className={`filter-tag ${isSelected ? 'is-selected' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleTerm(term);
                        }}
                        aria-pressed={isSelected}
                    >
                        {term}
                    </button>
                );
            })}
        </div>
    );
};

export { SearchTerms, FilterTags };
