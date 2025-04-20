const express = require('express')
const router = express.Router()
const { Runs } = require('../models')

router.get("/", async (req,res) => {

    const listOfRuns = await Runs.findAll()
    res.json(listOfRuns);
});

router.post("/", async (req, res) => {
    const run = req.body;
    await Runs.create(run);
    res.json(run);
})

module.exports = router