const socket = io()

let playerTurn = true
let playerSymbol = "X"



socket.on("startGame", (symbol) => {
    playerTurn = symbol === "X"
    playerSymbol = symbol

    $(".game > button").attr("disabled", !playerTurn)
    $("#message").text(playerTurn ? "It's your turn." : "It's your opponent's turn.")
})

socket.on("updateGame", (symbol, button) => {
    playerTurn = playerSymbol !== symbol

    $(`#${button}`).text(symbol)
    $(".game > button").attr("disabled", !playerTurn)
    $("#message").text(playerTurn ? "It's your turn." : "It's your opponent's turn.")

    const combos = [
        $("#00").text() + $("#01").text() + $("#02").text(),
        $("#10").text() + $("#11").text() + $("#12").text(),
        $("#20").text() + $("#21").text() + $("#22").text(),
        $("#00").text() + $("#10").text() + $("#20").text(),
        $("#01").text() + $("#11").text() + $("#21").text(),
        $("#02").text() + $("#12").text() + $("#22").text(),
        $("#00").text() + $("#11").text() + $("#22").text(),
        $("#02").text() + $("#11").text() + $("#20").text()
    ]
    
    for (let i = 0; i < combos.length; i++)
    {
        if (combos[i] === "XXX") alert("Player X has won!")
        else if (combos[i] === "OOO") alert("Player O has won!")     
    }

})

$(document).ready(() => {
    $(".game > button").attr("disabled", true)
    $(".game > button").click(function (event) {
        if (!playerTurn) return
        if ($(this).text().length) return

        socket.emit("makeMove", playerSymbol, $(this).attr("id"))
    })
})