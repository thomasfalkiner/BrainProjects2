const express = require('express')
const router = express.Router()
const { Subjects, Sessions, Runs, NData } = require('../models')
const { validateToken } = require("../middleware/AuthMiddleware")
const { Op } = require('sequelize')

async function getIdByNumber(table, numberColumn, idColumn, number) {
    try {
        const id = await table.findOne({
            where: {
                [numberColumn]: number
            },
            attributes: [idColumn]
        })
        if (!id) {
            console.log("No id for value")
            return null;
        }
        return id[idColumn]
    }
    catch (error) {
        console.log("Error with ID fetch", error)
        throw error;
    }
}

async function getSessionIdByNumber(table, numberColumn, idColumn, number, location) {
    try {
        const id = await table.findOne({
            where: {
                [numberColumn]: number,
                location: location
            },
            attributes: [idColumn]
        })
        if (!id) {
            console.log("No id for value")
            return null;
        }
        return id[idColumn]
    }
    catch (error) {
        console.log("Error with ID fetch", error)
        throw error;
    }
}

router.get("/", validateToken, async (req, res) => {
    try {
        const { subject, session, run, location } = req.query;
        console.log(subject,session,run,location)
        let runOptions = req.query.runOptions;

        if (runOptions && !Array.isArray(runOptions)) {
            runOptions = [runOptions];
        }

        const subjectId = subject ? await getIdByNumber(Subjects, 'subjectNumber', 'subjectId', subject) : null;
        const sessionId = session ? await getSessionIdByNumber(Sessions, 'sessionNumber', 'sessionId', session, location) : null;
        const runId = run ? await getIdByNumber(Runs, 'runNumber', 'runId', run) : null;

        const subjectFilter = subjectId ? { subjectId } : {};
        const sessionFilter = sessionId ? { sessionId } : {};
        const runFilter = runId ? { runId } : {};
        const ndataFilter = runOptions ? { taskType: { [Op.in]: runOptions } } : {};

        if (!subjectId && subject){
            res.json({ message: "Can't find that user" });
        }
        else if (!sessionId && session){
            res.json({ message: "Can't find that session" });
        }
        else if (!runId && run){
            res.json({ message: "Can't find that run" });
        }

        // Handle the correct model based on the query parameters.
        let model = NData;

        // Prioritize the more specific model based on the query params
        if (run && !subject && !session && !runOptions) {
            model = Runs;  // If querying only by run
        } else if (session && subject && !run && !runOptions) {
            model = Runs;  // If querying by session and subject, use Runs model
        } else if (!run && session && !subject && !runOptions) {
            model = Sessions;  // If querying only by session
        } else if (!run && !session && subject && !runOptions) {
            model = Subjects;  // If querying only by subject
        }
        console.log(model)
        // Query based on the selected model
        const result = await model.findAll({
            where: model === NData ? ndataFilter :
                   model === Runs ? runFilter :
                   model === Sessions ? sessionFilter :
                   subjectFilter,
            attributes: {exclude: ['rawdata']},
            include: []  // No associations needed, we just want the queried model's data
        });

        if (result && Array.isArray(result) && result.length > 0) {
            const formattedResult = result.map(item => item.dataValues);  // Only return dataValues for the selected model
            console.log(formattedResult)
            res.json(formattedResult);  // Send the clean data as response
        } else {
            res.json({ message: "Can't find anything" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

module.exports = router;
