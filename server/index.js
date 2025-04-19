const express = require('express')
const app = express();
const port = 3001
const cors = require("cors")

app.use(cors());
app.use(express.json())

const db = require("./models")

const postsRouter = require("./routes/Posts")
app.use("/Posts", postsRouter)
const sessionsRouter = require("./routes/Sessions")
app.use("/Sessions", sessionsRouter)
const subjectsRouter = require("./routes/Subjects")
app.use("/Subjects", subjectsRouter)

db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log("server running")
    })
})