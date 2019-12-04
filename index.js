require("dotenv").config()

const express = require("express")
const app = express()
const server = require("http").Server(app)

server.listen(80, () => console.log("Listening on %s.", server.address().port))

const mysql = require("mysql")
const connection = mysql.createConnection({
  	host: process.env.DBHOST,
  	user: process.env.DBUSER,
  	password: process.env.DBPASS,
  	database: process.env.DBDATABASE
})

connection.connect((err) => {
  	if (err) return console.error("Error Connecting: %s", err.stack)
    console.log("Connected as ID: %d", connection.threadId)
})

app.use(express.static("./client"))
app.get("/", (req, res) => res.sendFile("./index.html"))

const client = require("socket.io")(server)

let pending = null

client.on("connection", (socket) => {
	if (pending) {
		console.log("%s is paired with %s", socket.id, pending)

		socket.join(pending)
		socket.in(pending).emit("startGame", "X")
		socket.emit("startGame", "O")

		pending = null
	}
	else {
		socket.join(socket.id)
		pending = socket.id
	}

	console.log("%s\tUser Connected", socket.id)

	socket.on("disconnect", () => {
		if (pending && pending === socket.id) pending = null
		console.log("%s\tUser Disconnected", socket.id)
	})
})