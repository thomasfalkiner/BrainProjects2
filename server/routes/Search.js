const express = require('express')
const router = express.Router()
const { Subjects, Sessions, Runs, MEG } = require('../models')
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
        const megFilter = runOptions ? { taskType: { [Op.in]: runOptions } } : {};

        // Handle the correct model based on the query parameters.
        let model = MEG;

        // Prioritize the more specific model based on the query params
        if (runId && !subjectId && !sessionId && !runOptions) {
            model = Runs;  // If querying only by run
        } else if (sessionId && subjectId && !runId && !runOptions) {
            model = Runs;  // If querying by session and subject, use Runs model
        } else if (!runId && sessionId && !subjectId && !runOptions) {
            model = Sessions;  // If querying only by session
        } else if (!runId && !sessionId && subjectId && !runOptions) {
            model = Subjects;  // If querying only by subject
        }

        // Query based on the selected model
        const result = await model.findAll({
            where: model === MEG ? megFilter :
                   model === Runs ? runFilter :
                   model === Sessions ? sessionFilter :
                   subjectFilter,
            include: []  // No associations needed, we just want the queried model's data
        });

        if (result && result.length > 0) {
            const formattedResult = result.map(item => item.dataValues);  // Only return dataValues for the selected model
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
