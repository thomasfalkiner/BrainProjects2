const express = require('express')
const app = express();
const port = 3001
const cors = require("cors")

app.use(cors());
app.use(express.json())

const db = require("./models")

const authRouter = require('./routes/Auth')
app.use("/login",authRouter)
const searchRouter = require("./routes/Search")
app.use("/search", searchRouter)
const sessionsRouter = require("./routes/Sessions")
app.use("/Sessions", sessionsRouter)
const subjectsRouter = require("./routes/Subjects")
app.use("/Subjects", subjectsRouter)
const usersRouter = require("./routes/Users")
app.use("/Users", usersRouter)

db.sequelize.sync({alter:true}).then(() => {
    app.listen(port, () => {
        console.log("server running")
    })
})