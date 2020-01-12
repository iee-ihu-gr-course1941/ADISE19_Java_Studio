const socket = io()

let playerTurn = true
let playerSymbol = "X"
let playerMoves = 0

function animateText(element, text) {
    element.slideUp()
    element.text(text)
    element.slideDown()
}

function resetBoard() {
    $(".game > button").text("")
}

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

socket.on("loginSuccess", (username) => {
    $(".play").slideDown()
    $(".login").slideUp()
    animateText($("#logged"), `You're logged in as ${username}.`)
})

socket.on("loginFailed", () => {
    $("#login_message").slideDown()
})

socket.on("opponentLeft", () => {
    $("#message").text("Your opponent has left the game.")
    $(".play > button").attr("disabled", false)
})

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
            $(".play").slideDown()
            $(".play > button").attr("disabled", false)
            $(".game > button").attr("disabled", true)
            $("#message").text("The game is over, it's a tie.")
        }
        else {
            $(".game > button").attr("disabled", !playerTurn)
            $("#message").text(playerTurn ? "It's your turn." : "It's your opponent's turn.")
        }
    }
    else {
        $(".play").slideDown()
        $(".play > button").attr("disabled", false)
        $(".game > button").attr("disabled", true)
        $("#message").text(playerTurn ? "The game is over, you lost." : "The game is over, you won.")
    }
})

$(document).ready(() => {
    $(".game > button").attr("disabled", true)
    $(".game > button").click(function (event) {
        const button = $(this)

        if (!playerTurn) return
        if (button.text().length) return

        playerMoves++
        socket.emit("makeMove", playerSymbol, button.attr("id"))
    })

    $("#play_player").click(function (event) {
        $(".play").slideUp()
        $(".play > button").attr("disabled", true)

        $(".game > button").text("")
        playerMoves = 0

        $("#message").text("Waiting for an opponent to join...").slideDown()
        
        socket.emit("queue")
    })

    $("#login_register").click(function (event) {
        const username = $("#username").val()
        const password = $("#password").val()

        if (!username) return
        if (!password) return

        socket.emit("login-register", username, password)    
    })
})