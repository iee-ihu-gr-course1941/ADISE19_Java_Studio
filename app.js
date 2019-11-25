const express = require("express");
const app = express();
const server = require("http").server(app);

app.get("/", (request, response) => response.sendFile(__dirname + "/client/index.html"));
app.use("/client", express.static(__dirname + "/client"));

server.listen(3000);

const SOCKET_LIST = {};
const io = require("socket.io")(server, {});

io.sockets.on("connection", (socket) => {
	socket.id = Math.random();
	socket.number = Math.floor(Math.random() * 10) + "";
	SOCKET_LIST[socket.id] = socket;
	socket.on("disconnect", () => delete SOCKET_LIST[socket.id]);
});