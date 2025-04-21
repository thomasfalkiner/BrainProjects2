const express = require('express')
const router = express.Router()
const { Subjects, Sessions, Runs, CRT } = require('../models')
const {validateToken} = require("../middleware/AuthMiddleware")
const { Op } = require('sequelize')

router.get("/", validateToken, async (req,res) => {
    const { subjectId, location, sessionId, run, runOptions} = req.query;

    let runOptionsArray = runOptions ? (Array.isArray(runOptions) ? runOptions : [runOptions]) : [];

    const subjectfilter = {}
    const sessionsfilter = {}
    const runfilter = {}
    const runOptionsfilter = {}

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

        const runOptionConditions = runOptionsArray.map(option => {
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
        }).filter(Boolean); 

        if (runOptionConditions.length) {
            runOptionsfilter[Op.or] = runOptionConditions;
        }
    }
    let searchResults;
    if (subjectId && !sessionId) { //get all sessions from subject
        searchResults = await Subjects.findAll({
            where: subjectfilter,
            include: [
                {
                    model: Sessions,
                    where: sessionsfilter,
                    include: [
                        {
                            model: Runs,
                            ...(runOptionsArray.length ? { attributes: runOptionsArray } : {})
                        },
                    ],
                },
            ],
        });
        return res.json({
            branch: "subject",
            data: searchResults.map(s => s.toJSON())
        })
    } else if (subjectId && sessionId && !run) { //get all runs from session
        searchResults = await Subjects.findAll({
            where: subjectfilter,
            include: [
                {
                    model: Sessions,
                    where: sessionsfilter,
                    include: [
                        {
                            model: Runs,
                            ...(runOptionsArray.length ? { attributes: runOptionsArray } : {})
                        },
                    ],
                },
            ],
        });
        return res.json({
            branch: "session",
            data: searchResults.map(s => s.toJSON())
        })
    } else if (subjectId && sessionId && run && !runOptions) { //get all fields from 1 run
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
                        },
                    ],
                },
            ],
        });
        return res.json({
            branch: "run",
            data: searchResults.map(s => s.toJSON())
        })
    }
    else if (subjectId && sessionId && run && runOptions) { //get all fields from 1 run
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
                            ...(runOptionsArray.length ? { attributes: runOptionsArray } : {})
                        },
                    ],
                },
            ],
        });
        return res.json({
            branch: "runOptions",
            data: searchResults.map(s => s.toJSON())
        })
    }
    else {
        res.json(searchResults)
    }
});



module.exports = router