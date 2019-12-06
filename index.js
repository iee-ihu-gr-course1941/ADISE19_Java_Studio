require("dotenv").config()

const express = require("express")
const app = express()

app.use(express.static("./client"))
app.get("/", (req, res) => res.sendFile("./index.html"))

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

const io = require("socket.io")(server)

let pending = null

io.on("connection", (socket) => {
	console.log("%s\tUser Connected", socket.id)

	if (pending) {
		console.log("%s is paired with %s", socket.id, pending)

		socket.emit("startGame", "O", pending)
		io.to(pending).emit("startGame", "X", socket.id)

		pending = null
	}
	else pending = socket.id

	socket.on("makeMove", (symbol, opponent, button) => {
		socket.emit("updateGame", symbol, button)
		io.to(opponent).emit("updateGame", symbol, button)
	})

	socket.on("disconnect", () => {
		if (pending && pending === socket.id) pending = null
		console.log("%s\tUser Disconnected", socket.id)
	})
})