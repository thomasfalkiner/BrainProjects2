import React from 'react';
import '../css/SearchResultDisplay.css';

const SearchResultDisplay = ({ input }) => {
  const data = JSON.parse(input);

  // Recursive function to render data at all levels
  const renderData = (data, level = 0) => {
    if (Array.isArray(data)) {
      // If it's an array, render each item in a list
      return (
        <ul className="nested-list" style={{ marginLeft: level * 1 + 'px' }}>
          {data.map((item, index) => (
            <li key={index} className="nested-item">
              {renderData(item, level + 1)} {/* Recursively render nested elements */}
            </li>
          ))}
        </ul>
      );
    } else if (typeof data === 'object' && data !== null) {
      // If it's an object, render each property key-value pair
      return (
        <div className="object-container" style={{ marginLeft: level * 1 + 'px' }}>
          {Object.entries(data).map(([key, value], index) => (
            <div key={index} className="object-entry">
              <strong>{key}:</strong> {renderData(value, level + 1)} {/* Recursively render values */}
            </div>
          ))}
        </div>
      );
    } else {
      // If it's a primitive value, just render it directly
      return <span>{data}</span>;
    }
  };

  return (
    <div className="search-result-display">
      {renderData(data)} {/* Start rendering the input data */}
    </div>
  );
};

export default SearchResultDisplay;