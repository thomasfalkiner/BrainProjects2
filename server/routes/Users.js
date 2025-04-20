const express = require('express')
const router = express.Router()
const { Users } = require('../models')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const {sign} = require("jsonwebtoken")

dotenv.config();

router.post("/", async (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
      Users.create({
        username: username,
        password: hash,
        admin: 0
      });
      res.json("SUCCESS");
    });
  });
  
  router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
    const user = await Users.findOne({ where: { username: username } });
  
    if (!user) return res.json({ error: "User details not recognised" });
  
    bcrypt.compare(password, user.password).then((match) => {
      if (!match) return res.json({ error: "User details not recognised" });
  
    const accessToken = sign(
      { username: user.username, id: user.id }, process.env.JWT_SECRET
       
      );
      res.json(accessToken);
    });
  });

module.exports = router