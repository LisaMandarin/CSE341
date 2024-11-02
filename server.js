const express = require("express")
const app = express()

app.use("/", require("./routes"))

const port = 3000
app.listen(process.env.port || port)
console.log("Web Server is listening at port " + (process.env.port || port));