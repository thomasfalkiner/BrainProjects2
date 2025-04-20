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
    console.log(runfilter)
    let searchResults;
    if (subjectId && !sessionId) { //get all sessions from subject
        console.log("all from subject")
        searchResults = await Subjects.findAll({
            where: subjectfilter,
            include: [
                {
                    model: Sessions,
                    where: sessionsfilter,
                    include: [
                        {
                            model: Runs,
                            attributes: runOptionsArray.length ? runOptionsArray : [], 
                        },
                    ],
                },
            ],
        });
    } else if (subjectId && sessionId && !run) { //get all runs from session
        console.log("all from session")
        searchResults = await Subjects.findAll({
            where: subjectfilter,
            include: [
                {
                    model: Sessions,
                    where: sessionsfilter,
                },
            ],
        });
    } else if (subjectId && sessionId && run && !runOptions) { //get all fields from 1 run
        console.log("all from run")
        console.log(runOptionsfilter)
        console.log(runOptions)
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
                            attributes: runOptionsArray.length ? runOptionsArray : [], 
                        },
                    ],
                },
            ],
        });
    }
      
      res.json(searchResults);
});

router.post("/", async (req, res) => {
    const post = req.body;
    await Posts.create(post);
    res.json(post);
})

module.exports = router