import React from "react";
import "../css/SearchResultDisplay.css"; // Make sure the CSS is applied

function SearchResultDisplay({ input }) {
  if (!input) return <div className="no-results">No results.</div>;

  // If input is a string, just display it
  if (typeof input === "string") {
    return <div className="no-results">{input}</div>;
  }

  // Ensure the input is an array, or treat it as one if it's a single object
  const results = Array.isArray(input) ? input : [input];

  const handleDownload = (fileBuffer, filetype, filename = "download") => {
    const uint8Array = new Uint8Array(fileBuffer.data);
    const blob = new Blob([uint8Array], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.${filetype}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Function to render dynamic fields for an object
  const renderDynamicFields = (item) => {
    return Object.keys(item).map((key, index) => {
      // If the key contains "data", it could be a rawdata field, handle it specifically
      if (key.toLowerCase().includes("rawdata") && item[key]?.data) {
        return (
          <div key={index} className="result-content">
            <p><strong>{key}:</strong> (Binary Data - Download Available)</p>
            <button
              className="download-button"
              onClick={() => handleDownload(item[key], item.filetype, item.filename)}
            >
              Download .{item.filetype}
            </button>
          </div>
        );
      }
      
      // If the key contains an object or array, render nested fields accordingly
      if (typeof item[key] === 'object' || Array.isArray(item[key])) {
        return (
          <div key={index} className="result-content">
            <h5>{key}</h5>
            {Array.isArray(item[key]) ? (
              <ul>
                {item[key].map((subItem, subIndex) => (
                  <li key={subIndex}>{JSON.stringify(subItem)}</li>
                ))}
              </ul>
            ) : (
              <pre>{JSON.stringify(item[key], null, 2)}</pre>
            )}
          </div>
        );
      }

      // Render normal key-value pairs
      return (
        <div key={index} className="result-content">
          <p><strong>{key}:</strong> {item[key]}</p>
        </div>
      );
    });
  };

  return (
    <div className="results-container">
      {results.map((item, index) => (
        <div key={item.id || index} className="result-item">
          <h4 className="result-title">Record {index + 1}</h4>
          {renderDynamicFields(item)}
        </div>
      ))}
    </div>
  );
}

export default SearchResultDisplay;
