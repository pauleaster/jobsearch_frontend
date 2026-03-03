import React from 'react';

const HeaderCell = ({ name, visualState = 'none', onClick }) => (
  <th className="header-cell" onClick={onClick} style={{ cursor: 'pointer' }}>
    <div className={`header-cell-inner sort-state-${visualState}`}>
      <span className="header-label">{name}</span>
      <span className="chevron-stack" aria-hidden="true">
        <span className="chevron up">▴</span>
        <span className="chevron down">▾</span>
      </span>
    </div>
  </th>
);

export default HeaderCell;
