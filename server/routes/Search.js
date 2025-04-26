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

async function getSessionIdByNumber(table, numberColumn, idColumn, number, location, subjectId) {
    try {
        const whereClause = {
            [numberColumn]:number,
            location:location
        }
        if (subjectId) {
            whereClause.subjectId = subjectId
        }
        const id = await table.findOne({
            where: whereClause,
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
        console.log("test",subject,session,run,location)
        let runOptions = req.query.runOptions;

        if (runOptions && !Array.isArray(runOptions)) {
            runOptions = [runOptions];
        }

        const subjectId = subject ? await getIdByNumber(Subjects, 'subjectNumber', 'subjectId', subject) : null;
        getSessionIdParams = {
            location: location,
            subjectId: subjectId
        }
        const sessionId = session ? await getSessionIdByNumber(Sessions, 'sessionNumber', 'sessionId', session, location, subjectId) : null;

        const subjectFilter = subjectId ? { subjectId } : {};
        const sessionFilter = sessionId ? { sessionId } : {};
        const ndataFilter = runOptions ? { taskType: { [Op.in]: runOptions }, runNumber:run } : {};

        if (!subjectId && subject){
            res.json({ message: "Can't find that user" });
        }
        else if (!sessionId && session){
            res.json({ message: "Can't find that session" });
        }
        let model = NData;
        if (!session && subject && !runOptions) { //if lowest level if subject, get all sessions for that subject
            model = Sessions;  // If querying only by session
        } else if (!run && !session && !subject && !runOptions) {//if no input, get all subjects
            model = Subjects;  // If querying only by subject
        }
        console.log(model)
        let result = {}
        if (model === Subjects) {
            result = await model.findAll({
                where:subjectFilter,
            })
        }
        else {
            includeSubject = {
                model: Subjects,
                where: subjectFilter,
            }
            if (model=== Sessions) {
                result = await model.findAll({
                    where:sessionFilter,
                    include: includeSubject
                })
            }
            else {
                includeSessions = {
                    model: Sessions,
                    where: sessionFilter,
                    include: includeSubject
                }
                if (model === NData) {
                    result = await model.findAll({
                        where:ndataFilter,
                        include: includeSessions,
                        attributes: {exclude: ['rawdata']}
                    })
                }
                else {
                    res.json({message:"not found"})
                }
            }
        }

        if (result.length > 0) {
            const formattedResult = result.map(item => {
                const data = item.dataValues;  // Get NData values
                // this was passing models stuff as well which I don't want
                delete data.Session;  // Remove the 'Session' field
                delete data.Subject;  // Remove the 'Subject' field
                return data;
            });
            console.log(formattedResult)
            res.json(formattedResult);  // Send the clean data as response
        } else {
            res.json({ message: "Can't find anything" });
        }
    }

        // query based on the selected model
        /*const result = await model.findAll({
            where: model === NData ? ndataFilter :
                   model === Runs ? runFilter :
                   model === Sessions ? sessionFilter :
                   subjectFilter,
            attributes: {exclude: ['rawdata']},
            include: []  // no associations needed, we just want the queried models data
        });*/

    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

module.exports = router;
