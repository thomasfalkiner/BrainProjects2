const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require ('jsonwebtoken')
const User = require('../models/Users')

const router = express.Router()
router.post('/register', async (req, res) => {

    const {username,password} = req.body;
    const hash = await bcrypt.hash(password,10)
    try {
        const user = await User.create({ username, password: hash })
        res.json({ message: 'Added new user '+ username})
    }
    catch (err){
        res.status(400).json({error:"Can't create; user already exists"})
    }
})

router.post('/login', async (req, res) => {

    const {username, password } = req.body
    const user = await User.findOne({ where: {username}})
    if (!user) {
        return res.status(401).json({error: "Invalid login details."})
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid){
        return res.status(401).json({error: "Invalid login details."})
    }
    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIN: '1h'});
    res.json({token})
})

module.exports = router