import React from 'react';
import axios from 'axios';

const BIDSUploader = () => {
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    
    // Make sure the selected file is a ZIP file
    if (file && file.name.endsWith('.zip')) {
      const formData = new FormData();
      formData.append('file', file);

      // Add the access token to the request headers
      const headers = {
        'accessToken': sessionStorage.getItem('accessToken'),  // Ensure correct token
      };

      try {
        const response = await axios.post('http://localhost:3001/upload', formData, {
          headers: headers,
        });
        console.log('File uploaded:', response.data);
        alert('Upload Successful');
      } catch (err) {
        console.error('Error uploading file:', err);
        alert('Error uploading file');
      }
    } else {
      alert('Please select a valid ZIP file.');
    }
  };

  return (
    <div>
      <h2>Upload BIDS Dataset (.zip)</h2>
      <input type="file" accept=".zip" onChange={handleUpload} />
    </div>
  );
};

export default BIDSUploader;
