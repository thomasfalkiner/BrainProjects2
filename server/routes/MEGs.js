const express = require('express')
const router = express.Router()
const { MEG } = require('../models')
const {validateToken} = require('../middleware/authMiddleware')

router.get("/", validateToken, async (req,res) => {

    const listOfMEG = await MEG.findAll()
    res.json(listOfMEG);
});

router.post("/", async (req, res) => {
    const meg = req.body;
    await MEG.create(meg);
    res.json(meg);
})

module.exports = router