const express = require('express')
const router = express.Router()
const { NData } = require('../models')
const {validateToken} = require('../middleware/authMiddleware')

router.get("/", validateToken, async (req,res) => {

    const listOfNData = await NData.findAll()
    res.json(listOfNData);
});

router.post("/", async (req, res) => {
    const ndata = req.body;
    await NData.create(ndata);
    res.json(ndata);
})

module.exports = router