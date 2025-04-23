const express = require('express')
const router = express.Router()
const { Sessions } = require('../models')
const {validateToken} = require('../middleware/authMiddleware')

router.get("/", validateToken, async (req, res) => {
    const { subjectId, location} = req.query;
    try {
        const results = await Sessions.findAll({
          where: {
            subjectId,
            location
          }
        });
    
        res.json(results);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        res.status(500).json({ error: "Failed to fetch sessions." });
      }
});

router.post("/", async (req, res) => {
    const session = req.body;
    await Sessions.create(session);
    res.json(session);
})

module.exports = router