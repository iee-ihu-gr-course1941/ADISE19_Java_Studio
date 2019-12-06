const socket = io()

let playerTurn = true
let playerSymbol = "X"
let playerOpponent

socket.on("startGame", (symbol, opponent) => {
    playerTurn = symbol === "X"
    playerSymbol = symbol
    playerOpponent = opponent

    $(".game > button").attr("disabled", !playerTurn)
    $("#message").text(playerTurn ? "It's your turn." : "It's your opponent's turn.")
})

socket.on("updateGame", (symbol, button) => {
    playerTurn = playerSymbol !== symbol

    $(`#${button}`).text(symbol)
    $(".game > button").attr("disabled", !playerTurn)
    $("#message").text(playerTurn ? "It's your turn." : "It's your opponent's turn.")
})

$(document).ready(() => {
    $(".game > button").attr("disabled", true)
    $(".game > button").click(function (event) {
        if (!playerTurn) return
        if ($(this).text().length) return

        socket.emit("makeMove", playerSymbol, playerOpponent, $(this).attr("id"))
    })
})