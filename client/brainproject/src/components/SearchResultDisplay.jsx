import React from "react";
import axios from "axios";
import "../css/SearchResultDisplay.css"; // Make sure the CSS is applied

function SearchResultDisplay({ input, accessToken }) {
  if (!input) return <div className="no-results">No results.</div>;

  // If input is a string, just display it
  if (typeof input === "string") {
    return <div className="no-results">{input}</div>;
  }

  // Ensure the input is an array, or treat it as one if it's a single object
  const results = Array.isArray(input) ? input : [input];

  const handleDownload = async ( id,filename ) => {
    try {
      const response = await axios.get("http://localhost:3001/download/", {
        headers: {
          accessToken:sessionStorage.getItem("accessToken")
        },
        params: {
          id:id
        },
        responseType: "blob"
      });
      console.log(response)
      /*if (!response.ok) {
        throw new Error("Failed to fetch raw data.");
      }*/

      // Get the response as a blob (binary data)

      // Create a URL for the blob
      const url = URL.createObjectURL(response.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}`; // Name the file based on taskType or any other logic
      a.click();
      URL.revokeObjectURL(url); // Clean up the URL after downloading
    } catch (error) {
      console.error("Error downloading raw data:", error);
      alert("There was an error while downloading the raw data.");
    }
  };

  // Function to render dynamic fields for an object
  const renderDynamicFields = (item) => {
    return Object.keys(item).map((key, index) => {
      if (key.toLowerCase() === "tasktype" && item[key]) {
        return (
          <div key={index} className="result-content">
            <p><strong>{key}:</strong> {item[key]}</p>
            <button
              className="download-button"
              onClick={() => handleDownload(item.id, item.filename)}
            >
              Download {item[key]} Data
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
