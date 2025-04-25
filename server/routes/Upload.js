const express = require('express');
const multer = require('multer');
const JSZip = require('jszip');
const { insertFromFileMetadata } = require('../middleware/bidsInserter');
const { validateToken } = require('../middleware/authMiddleware');
const { Subjects} = require('../models');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const parseSessionInfo = (sessionName) => {
  const match = sessionName.match(/^ses-(\d+)([a-zA-Z]+)?$/);
  return {
    sessionNumber: match?.[1],
    location: match?.[2] || null,
  };
};

router.post('/', upload.single('file'), validateToken, async (req, res) => {
  try {
    console.log("Received file for upload");

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const zip = await JSZip.loadAsync(req.file.buffer);

    const fileEntries = Object.keys(zip.files).filter(
      (filename) => !zip.files[filename].dir  
    );

    console.log("Files in ZIP:", fileEntries);

    for (const relativePath of fileEntries) {
      const file = zip.files[relativePath];
      const buffer = await file.async('nodebuffer');
      const parts = relativePath.split('/');
        console.log(relativePath)
      // Find the subject and session directories
      const subFolder = parts.find((p) => p.startsWith('sub-'));  
      const sesFolder = parts.find((p) => p.startsWith('ses-'));  
      console.log(parts)

      if (!subFolder || !sesFolder) {
        console.error('Subject or session folder missing in path:', relativePath);
        continue;  
      }

      const subjectNumber = parseInt(subFolder.split('-')[1], 10);  // Explicitly convert to integer
      if (isNaN(subjectNumber)) {
        console.error('Invalid subject number for path:', relativePath);
        continue;  
      }

      console.log('Creating/finding subject with subjectNumber:', subjectNumber);

      const [subject] = await Subjects.findOrCreate({
        where: { subjectNumber }, 
        defaults: { subjectNumber }, 
      });

      console.log('Subject found/created:', subject);

      const { sessionNumber, location } = parseSessionInfo(sesFolder);

      await insertFromFileMetadata({
        path: relativePath,
        file: { buffer },
        meta: { subjectNumber, sessionNumber, location },
      });

    }

    res.json({ message: 'ZIP processed successfully' });
  } catch (err) {
    console.error('ZIP Upload Error:', err);
    res.status(500).json({ error: 'Failed to process zip file' });
  }
});

module.exports = router;
