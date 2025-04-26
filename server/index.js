const express = require('express')
const app = express();
const port = 3001
const cors = require("cors")

app.use(cors());
app.use(express.json())

const db = require("./models")

const searchRouter = require("./routes/Search")
app.use("/search", searchRouter)
const sessionsRouter = require("./routes/Sessions")
app.use("/Sessions", sessionsRouter)
const subjectsRouter = require("./routes/Subjects")
app.use("/Subjects", subjectsRouter)
const megRouter = require("./routes/NData")
app.use("/NData", megRouter)
const usersRouter = require("./routes/Users")
app.use("/users", usersRouter)
const uploadRouter = require("./routes/Upload")
app.use("/upload", uploadRouter)
const downloadRouter = require("./routes/Download")
app.use("/download", downloadRouter)

db.sequelize.sync({}).then(() => {
    app.listen(port, () => {
        console.log("server running")
    })
})