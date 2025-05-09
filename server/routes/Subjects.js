const express = require('express')
const router = express.Router()
const { Subjects } = require('../models')
const {validateToken} = require('../middleware/authMiddleware')

router.get("/", validateToken, async (req,res) => {

    const listOfSubjects = await Subjects.findAll()
    res.json(listOfSubjects);
});

router.post("/", async (req, res) => {
    const subject = req.body;
    await Subjects.create(subject);
    res.json(subject);
})

module.exports = router