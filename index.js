require("dotenv").config()

const express = require("express")
const app = express()

app.use(express.static("./client"))
app.get("/", (req, res) => res.sendFile("./index.html"))

const http = require("http")
const server = http.Server(app)

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

	socket.on("queue player", () => {
		if (pending) {
			console.log("%s is paired with %s", socket.username, pending.username)

			socket.opponent = pending
			pending.opponent = socket

			socket.emit("game started", "O")
			pending.emit("game started", "X")

			let query = mysql.format("INSERT INTO rooms (player1, player2) VALUES (?, ?)", [socket.username, pending.username])
			connection.query(query, (err, results, fields) => {
				if (err) console.error(err)

				socket.room = results.insertId
				pending.room = results.insertId
				pending = null
			})
		}
		else pending = socket
	})

	socket.on("queue computer", () => {
		let query = mysql.format("INSERT INTO rooms (player1, player2) VALUES (?, ?)", [socket.username, "Computer"])
		connection.query(query, (err, results, fields) => {
			if (err) console.error(err)

			socket.room = results.insertId
		})
		socket.emit("game with computer")
	})

	socket.on("finish game", () => {
		socket.emit("game tied")
		socket.opponent.emit("game tied")
	})

	socket.on("make move", (symbol, button) => {
		let query = mysql.format("INSERT INTO moves (room, player, button, symbol) VALUES (?, ?, ?, ?)", [socket.room, socket.username, button, symbol])
		connection.query(query, (err, results, fields) => {
			if (err) console.error(err)
		})
		socket.emit("update game", symbol, button)
		socket.opponent.emit("update game", symbol, button)
	})

	socket.on("login register", (username, password) => {
        let query = mysql.format("SELECT username, password FROM users WHERE username=?", [username])
        connection.query(query, (err, results, fields) => {
            if (err) console.error(err)

            const result = results[0]

            if (result)
            {
            	if (result.password === password) {
            		socket.username = username
            		socket.emit("login successful", username)
            	}
            	else socket.emit("login failed")
            }
        	else {
        		let query = mysql.format("INSERT INTO users (username, password) VALUES (?, ?)", [username, password])
        		connection.query(query, (err, results, fields) => {
        			if (err) console.error(err)

            		socket.username = username
        			socket.emit("login successful", username)
        		})
        	}
        })
    })

	socket.on("disconnect", () => {
		if (pending && pending === socket.id) pending = null
		if (socket.opponent) socket.opponent.emit("opponent left")
		console.log("%s\tUser Disconnected", socket.id)
	})
})