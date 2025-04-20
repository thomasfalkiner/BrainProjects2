const express = require('express')
const router = express.Router()
const { Subjects, Sessions, Runs, CRT } = require('../models')

router.get("/", async (req,res) => {
    const { subjectId, location, sessionId, runId, runoptions } = req.query;
    const subjectfilter = {}
    const sessionsfilter = {}
    const runsfilter = {}
    if (subjectId) {
        subjectfilter.subjectId = Number(subjectId)
    }
    if (location) {
        sessionsfilter.location = location
    }
    if (sessionId) {
        sessionsfilter.sessionId = Number(sessionId)
    }
    if (runId) {
        runfilter.runId = Number(runId)
    }
    if (runoptions) {
        if (runoptions.rest) {
            runfilter.rest = rest
        }
    }
    const searchResults = await Subjects.findAll(
        {where:subjectfilter,
            include: [
                {
                    model: Sessions,
                    where: Object.keys(sessionsfilter).length ? sessionsfilter : undefined,
                    include: [
                        {
                            model: Runs,
                            where: Object.keys(runsfilter).length ? runsfilter : undefined
                        }
                    ]
                }
            ]
        })
    res.json(searchResults);
});

router.post("/", async (req, res) => {
    const post = req.body;
    await Posts.create(post);
    res.json(post);
})

module.exports = router