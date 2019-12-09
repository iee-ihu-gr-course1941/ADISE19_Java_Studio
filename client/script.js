const socket = io()

let playerTurn = true
let playerSymbol = "X"
let playerMoves = 0

function isGameOver() {
    const combos = [
        $("#0").text() + $("#1").text() + $("#2").text(),
        $("#3").text() + $("#4").text() + $("#5").text(),
        $("#6").text() + $("#7").text() + $("#8").text(),
        $("#0").text() + $("#3").text() + $("#6").text(),
        $("#1").text() + $("#4").text() + $("#7").text(),
        $("#2").text() + $("#5").text() + $("#8").text(),
        $("#0").text() + $("#4").text() + $("#8").text(),
        $("#2").text() + $("#4").text() + $("#6").text()
    ]
    
    for (let i = 0; i < combos.length; i++) 
        if (combos[i] === "XXX" || combos[i] === "OOO") return true

    return false
}

socket.on("startGame", (symbol) => {
    playerTurn = symbol === "X"
    playerSymbol = symbol

    $(".game > button").attr("disabled", !playerTurn)
    $("#message").text(playerTurn ? "It's your turn." : "It's your opponent's turn.")
})

socket.on("updateGame", (symbol, button) => {
    playerTurn = playerSymbol !== symbol

    $(`#${button}`).text(symbol)

    if(!isGameOver()) {
        if (playerMoves > 4) {
            $(".game > button").attr("disabled", true)
            $("#message").text("The game is over, it's a tie.")
        }
        else {
            $(".game > button").attr("disabled", !playerTurn)
            $("#message").text(playerTurn ? "It's your turn." : "It's your opponent's turn.")
        }
    }
    else {
        $(".game > button").attr("disabled", true)
        $("#message").text(playerTurn ? "The game is over, you lost." : "The game is over, you won.")
    }
})

$(document).ready(() => {
    $(".game > button").attr("disabled", true)
    $(".game > button").click(function (event) {
        if (!playerTurn) return
        if ($(this).text().length) return

        playerMoves++
        socket.emit("makeMove", playerSymbol, $(this).attr("id"))
    })
})