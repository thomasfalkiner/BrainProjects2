const express = require('express')
const router = express.Router()
const { Subjects, Sessions, Runs, MEG } = require('../models')
const {validateToken} = require("../middleware/AuthMiddleware")
const { Op } = require('sequelize')

async function getIdByNumber(table, numberColumn, idColumn, number) {
    try {
        const id = await table.findOne({
            where: {
                [numberColumn]: number
            },
            attributes: [idColumn]
        })
        if (!id){
            console.log("No id for value")
            return null;
        }
        return id[idColumn]
    }
    catch (error){
        console.log("Error with ID fetch", error)
        throw error;
    }

}
async function getSessionIdByNumber(table, numberColumn, idColumn, number, location) {
    try {
        const id = await table.findAll({
            where: {
                [numberColumn]: number,
                location:location
            },
            attributes: [idColumn]
        })
        if (!id){
            console.log("No id for value")
            return null;
        }
        return id[idColumn]
    }
    catch (error){
        console.log("Error with ID fetch", error)
        throw error;
    }

}

function constructQuery(model,filter, include) {
    const includeArray = Array.isArray(include) ? include : [include].filter(Boolean);
    return ({
        model: model,
        where: filter,
        include: includeArray
    })
}

router.get("/", validateToken, async (req, res) => {
    try {
      const { subject, session, run, location} = req.query;

      let runOptions = req.query.runOptions;
    
      // Normalize runOptions to an array
      if (runOptions && !Array.isArray(runOptions)) {
        runOptions = [runOptions];
      }
      const subjectId = await getIdByNumber(Subjects, 'subjectNumber', 'subjectId', subject)
      const sessionId = await getSessionIdByNumber(Sessions,'sessionNumber', 'sessionId', session, location)
      const runId = await getIdByNumber(Runs, 'runNumber', 'runId', run)
      
      let lowestModel
      let optionsQuery = {}


      if (runOptions) {
        lowestModel = MEG
        const orConditions = runOptions.map(option => ({ tasktype: option }));
        optionsQuery = constructQuery(MEG,{ [Op.or]: orConditions},{})
      }
      if (runId) {
        if (!runOptions) {lowestModel = Runs}
        optionsQuery = constructQuery(Runs,{runId:runId},optionsQuery)

      }
      if (sessionId) {
        if (!runOptions && !run) {lowestModel = Sessions}
        if (!run && runOptions) {
            optionsQuery = constructQuery(Runs,{},optionsQuery)
        }
        optionsQuery = constructQuery(Sessions,{sessionId:sessionId},optionsQuery)
      }
      if (subjectId) {
        if (!runOptions && !run && !session) {lowestModel = Subjects}
        if (!session && (run || runOptions)) {
            if (!run && runOptions){
                optionsQuery = constructQuery(Runs,{},optionsQuery)
            }
            optionsQuery = constructQuery(Sessions,{},optionsQuery)
        }

        optionsQuery = constructQuery(Subjects,{subjectId:subjectId},optionsQuery)
      }
    //console.log("optionsquery:",optionsQuery)
    try {
        const result = await lowestModel.findAll({optionsQuery})
        if (result && result.length > 0){
            res.json(result);
        }
        else {
            res.json({message: "Can't find anything"})
        }
    }
    catch (err) {
        res.json({message: "Can't find anything"})
    }
  }
  catch {

  }
});



module.exports = router