import React from "react";

function SearchResultDisplay({ input }) {
  if (!input) return <div>No results.</div>;

  // Handle "not found" or string errors
  if (typeof input === "string") {
    return <div>{input}</div>;
  }

  // Make sure it's an array
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

  return (
    <div style={{ marginTop: "1rem" }}>
      {results.map((item, index) => (
        <div
          key={item.id || index}
          style={{
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "1rem",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h4>Task: {item.taskType}</h4>
          <p><strong>Filename:</strong> {item.filename}</p>
          <p><strong>Run ID:</strong> {item.runId}</p>
          <p><strong>Created:</strong> {new Date(item.createdAt).toLocaleString()}</p>

          {item.filetype && item.rawdata?.data ? (
            <button
              onClick={() => handleDownload(item.rawdata, item.filetype, item.filename)}
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                cursor: "pointer"
              }}
            >
              Download .{item.filetype}
            </button>
          ) : (
            <p style={{ color: "gray" }}><em>No downloadable file</em></p>
          )}
        </div>
      ))}
    </div>
  );
}

export default SearchResultDisplay;