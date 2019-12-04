require("dotenv").config()

const express = require("express")
const app = express()
const server = require("http").Server(app)

const mysql = require('mysql')
const connection = mysql.createConnection({
  	host: process.env.DBHOST,
  	user: process.env.DBUSER,
  	password: process.env.DBPASS
})

connection.connect((err) => {
  	if (err) return console.error('error connecting: ' + err.stack)
    console.log('connected as id ' + connection.threadId)
})

connection.query(`SELECT * FROM users;`, (error, results, fields) => {
	if (error) throw error
	console.log(results)
})

server.listen(80, () => console.log(`Listening on ${server.address().port}.`))

app.use(express.static("./client"))
app.get("/", (req, res) => res.sendFile("./index.html"))

const client = require("socket.io")(server)

let pending = null

client.on("connection", (socket) => {
	if (pending) {
		console.log(`${socket.id} is paired with ${pending}`)

		socket.join(pending)
		socket.in(pending).emit("startGame", "X")
		socket.emit("startGame", "O")

		pending = null
	}
	else {
		socket.join(socket.id)
		pending = socket.id
	}

	console.log(`${socket.id}\tUser Connected`)

	socket.on("disconnect", () => {
		if (pending && pending === socket.id) pending = null
		console.log(`${socket.id}\tUser Disconnected`)
	})
})