const express = require('express');
const multer = require('multer');
const JSZip = require('jszip');
const { insertFromFileMetadata } = require('../middleware/bidsInserter');
const { validateToken } = require('../middleware/authMiddleware');
const { Subjects, Sessions, Runs, MEG } = require('../models');

const router = express.Router();

// Set up multer to handle memory storage for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Parse session info from folder names like 'ses-01L'
const parseSessionInfo = (sessionName) => {
  const match = sessionName.match(/^ses-(\d+)([a-zA-Z]+)?$/);
  return {
    sessionNumber: match?.[1],
    location: match?.[2] || null,
  };
};

// Handle the upload of a ZIP file containing multiple files and directories
router.post('/', upload.single('file'), validateToken, async (req, res) => {
  try {
    console.log("Received file for upload");

    // Check if the file is present
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Load the ZIP file from the uploaded buffer
    const zip = await JSZip.loadAsync(req.file.buffer);

    // Extract all files from the ZIP, filtering out directories
    const fileEntries = Object.keys(zip.files).filter(
      (filename) => !zip.files[filename].dir  // Skip directories
    );

    console.log("Files in ZIP:", fileEntries);

    // Loop through each file in the ZIP and process it
    for (const relativePath of fileEntries) {
      const file = zip.files[relativePath];
      const buffer = await file.async('nodebuffer');
      const parts = relativePath.split('/');

      // Find the subject and session directories
      const subFolder = parts.find((p) => p.startsWith('sub-'));  // Example: sub-01
      const sesFolder = parts.find((p) => p.startsWith('ses-'));  // Example: ses-01paris
      const megFolder = parts.find((p) => p.startsWith('meg'));  // Example: meg/

      if (!subFolder || !sesFolder) {
        console.error('Subject or session folder missing in path:', relativePath);
        continue;  // Skip if subject or session is missing
      }

      // Extract the subject number from the 'sub-XXXX' folder
      const subjectNumber = parseInt(subFolder.split('-')[1], 10);  // Explicitly convert to integer
      if (isNaN(subjectNumber)) {
        console.error('Invalid subject number for path:', relativePath);
        continue;  // Skip if subject number is invalid
      }

      console.log('Creating/finding subject with subjectNumber:', subjectNumber);

      // Instead of passing subjectId, only pass subjectNumber and let Sequelize create the subjectId
      const [subject] = await Subjects.findOrCreate({
        where: { subjectNumber }, // Ensure unique subject by subjectNumber
        defaults: { subjectNumber }, // Only subjectNumber is passed here
      });

      console.log('Subject found/created:', subject);

      const { sessionNumber, location } = parseSessionInfo(sesFolder);

      // Insert subject and session metadata into the database
      await insertFromFileMetadata({
        path: relativePath,
        file: { buffer },
        meta: { subjectNumber, sessionNumber, location },
      });

      // Process the MEG files if they exist in the 'meg' folder
    }

    res.json({ message: 'ZIP processed successfully' });
  } catch (err) {
    console.error('ZIP Upload Error:', err);
    res.status(500).json({ error: 'Failed to process zip file' });
  }
});

module.exports = router;
