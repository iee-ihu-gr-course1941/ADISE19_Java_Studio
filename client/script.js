const socket = io()

let turn = false

socket.on("startGame", (symbol) => {
	if (symbol === "X") turn = true
	$("#message").text(turn ? "It's your turn." : "It's your opponent's turn.")
})