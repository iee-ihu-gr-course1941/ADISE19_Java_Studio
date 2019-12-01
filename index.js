const express = require("express")
const app = express()
const server = require("http").Server(app)

server.listen(80, () => console.log(`Listening on ${server.address().port}.`))

app.use(express.static("./client"))
app.get("/", (req, res) => res.sendFile("./index.html"))

const client = require("socket.io")(server)

client.on("connection", (socket) => {
	console.log(`User Connected`)
	socket.on("disconnect", () => console.log(`User Disconnected`))
})