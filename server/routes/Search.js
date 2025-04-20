const express = require('express')
const router = express.Router()
const { Subjects, Sessions, Runs, CRT } = require('../models')
const {validateToken} = require("../middleware/AuthMiddleware")
const { Op } = require('sequelize')

router.get("/", validateToken, async (req,res) => {
    console.log(req.query)
    const { subjectId, location, sessionId, run} = req.query;
    let runOptions = req.query.runOptions;
    if (runOptions && !Array.isArray(runOptions)){
        runOptions = [runOptions]
    }

    const subjectfilter = {}
    const sessionsfilter = {}
    const runfilter = {}

    if (subjectId) {
        subjectfilter.subjectId = Number(subjectId)
    }
    if (location) {
        sessionsfilter.location = location
    }
    if (sessionId) {
        sessionsfilter.sessionId = Number(sessionId)
    }
    if (run) {
        runfilter.run = Number(run)
    }

    if (runOptions?.length) {
        // Each runOption will be checked as a property with non-null values
        const runOptionConditions = runOptions.map(option => {
            switch (option) {
                case 'rest':
                case 'noise':
                case 'spatt':
                case 'crt':
                case 'emoface':
                case 'flair':
                case 't1w':
                case 'crt_bold':
                case 'crt_events':
                    return { [option]: { [Op.not]: null } };
                default:
                    return null;
            }
        }).filter(Boolean); // Remove any undefined entries

        // If there are any valid runOption conditions, use Op.or to join them
        if (runOptionConditions.length) {
            runfilter[Op.or] = runOptionConditions;
        }
    }
    console.log(runfilter)
    let searchResults;
    if (subjectId && !sessionId) {
        // If only subjectId is present, return all sessions for that subjectId
        searchResults = await Subjects.findAll({
            where: subjectfilter,
            include: [
                {
                    model: Sessions,
                    where: sessionsfilter,
                    include: [
                        {
                            model: Runs,
                            attributes: runOptionsArray.length ? runOptionsArray : [], // Only include selected runOptions
                        },
                    ],
                },
            ],
        });
    } else if (subjectId && sessionId && !run) {
        // If subjectId and sessionId are present, return all runs for that session
        searchResults = await Subjects.findAll({
            where: subjectfilter,
            include: [
                {
                    model: Sessions,
                    where: sessionsfilter,
                    include: [
                        {
                            model: Runs,
                            attributes: runOptions.length ? runOptions : [], // Only include selected runOptions
                        },
                    ],
                },
            ],
        });
    } else if (subjectId && sessionId && run) {
        // If subjectId, sessionId, and run are present, return the selected runOptions
        searchResults = await Subjects.findAll({
            where: subjectfilter,
            include: [
                {
                    model: Sessions,
                    where: sessionsfilter,
                    include: [
                        {
                            model: Runs,
                            where: runfilter,
                            attributes: runOptions.length ? runOptions : [], // Only include selected runOptions
                        },
                    ],
                },
            ],
        });
    }

    // Send the search results back as JSON
    res.json(searchResults);
});

router.post("/", async (req, res) => {
    const post = req.body;
    await Posts.create(post);
    res.json(post);
})

module.exports = router