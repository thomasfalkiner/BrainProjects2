const express = require('express')
const bcrypt = require('bcrypt')
const {sign} = require ('jsonwebtoken')
const {Users} = require('../models')
const {validateToken} = require('../middleware/authMiddleware')
const { validateAdmin } = require('../middleware/authAdmin')

const router = express.Router()
router.post('/register', async (req, res) => {
    console.log("test")
    const {username,password} = req.body;
    const hash = await bcrypt.hash(password,10)
    try {
        const user = await Users.create({ username, password: hash, admin: false })
        res.json({ message: "User created"})
    }
    catch (err){
        res.json({message:"User already exists"})
    }
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username: username } });

    if (!user) return res.json({ error: "User details not recognised" });

    bcrypt.compare(password, user.password).then((match) => {
        if (!match) return res.json({ error: "User details not recognised" });

    const accessToken = sign(
        { username: user.username, id: user.userId, admin: user.admin }, process.env.JWT_SECRET
        
        );
        res.json(accessToken);
    });
});
router.post("/check", validateToken, async (req, res) => {
    res.json({valid: true, user: req.user})
})

module.exports = router