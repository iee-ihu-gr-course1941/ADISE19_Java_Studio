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
		console.log("%s is paired with %s", socket.id, pending.id)

		socket.opponent = pending
		pending.opponent = socket

		socket.emit("startGame", "O")
		pending.emit("startGame", "X")

		pending = null
	}
	else pending = socket

	socket.on("makeMove", (symbol, button) => {
		socket.emit("updateGame", symbol, button)
		socket.opponent.emit("updateGame", symbol, button)
	})

	socket.on("loginRegister", (username, password) => {
        const query = mysql.format("SELECT username FROM users WHERE username=?", [username])
        connection.query(query, (error, results, fields) => {
            if (error) throw error
            if (results[0]) console.log("Username: ", results[0].username)
        })
    })

	socket.on("disconnect", () => {
		if (pending && pending === socket.id) pending = null
		console.log("%s\tUser Disconnected", socket.id)
	})
})