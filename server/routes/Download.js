const express = require('express')
const router = express.Router()
const { NData } = require('../models')
const {validateToken} = require('../middleware/authMiddleware')

router.get("/", validateToken, async (req, res) => {
    try {
        const { id } = req.query

        // Assuming you are querying NData model for rawData
        const rawDataRecord = await NData.findOne({
            where: { id },
            attributes: ['rawdata','filename']  
        });

        if (!rawDataRecord) {
            return res.status(404).json({ message: "No raw data found for the given filters." });
        }

        // Send the raw data as a file download
        const rawDataBuffer = rawDataRecord.rawdata;
        const filename = rawDataRecord.filename;
        console.log(filename)
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        console.dir(res.getHeaders(), null)
        console.log(rawDataBuffer)
        res.send(rawDataBuffer); // Send the raw binary data as a response

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

module.exports = router