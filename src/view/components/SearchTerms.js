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
    mode, // 'inclusive' | 'exclusive'
    onCopy,
    copied,
    onSelectAll,
    onSelectNone,
}) => {
    const terms = Array.isArray(filterTags) ? filterTags : searchTerms;

    if (!Array.isArray(terms) || terms.length === 0 || typeof onToggleTerm !== 'function') {
        return null;
    }

    const handleCopy = () => {
        const active = terms
            .map(t => t?.Term)
            .filter(t => t && selectedTerms.has(t))
            .join(', ');
        onCopy?.(active);
    };

    return (
        <div className={`filter-tags-wrapper${mode ? ` filter-tags-wrapper--${mode}` : ''}`}>
            {mode && (
                <div className="filter-tags-header">
                    <span className={`filter-tags-mode-label filter-tags-mode-label--${mode}`}>
                        {mode === 'inclusive' ? '✚ Include' : mode === 'mandatory' ? '★ Mandatory' : '✖ Exclude'}
                    </span>
                    <div className="filter-tags-select-btns">
                        {(onSelectAll !== undefined || onSelectNone !== undefined) && (
                            <div className="filter-tags-select-btns">
                                <button
                                    type="button"
                                    className="filter-tags-select-btn"
                                    disabled={!onSelectAll}
                                    onClick={() => onSelectAll?.()}
                                >All</button>
                                <button
                                    type="button"
                                    className="filter-tags-select-btn"
                                    disabled={!onSelectNone}
                                    onClick={() => onSelectNone?.()}
                                >None</button>
                            </div>
                        )}
                    </div>
                    <div className="filter-tags-copy-wrapper">
                        {copied && <span className="filter-tags-copy-toast">Copied!</span>}
                        <button
                            type="button"
                            className="filter-tags-copy-btn"
                            title="Copy active tags"
                            onClick={handleCopy}
                        >
                            ⧉
                        </button>
                    </div>
                </div>
            )}
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
                            onClick={(e) => { e.stopPropagation(); onToggleTerm(term); }}
                            aria-pressed={isSelected}
                        >
                            {term}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export { SearchTerms, FilterTags };
