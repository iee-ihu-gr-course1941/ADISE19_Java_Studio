# Tic Tac Toe by Java Studio
A multiplayer Tic Tac Toe that supports multiple games at the same time against real players or against the computer.

## Java Studio
- Pasenidis Dionysios
- Ntailakis Stelios
- Karavas Mihail

## Node Package Modules
- [express.js](https://www.npmjs.com/package/express)
- [socket.io](https://www.npmjs.com/package/socket.io)
- [mysql](https://www.npmjs.com/package/mysql)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Other Resources
- [jquery](https://jquery.com/)
- [skeleton](http://getskeleton.com/)

## How to run
1. Download and install [node.js](https://nodejs.org/en/)
2. Clone the project
2. Open the node.js command prompt
3. Navigate to the project's root directory
4. Type ```node index.js``` in the command prompt to run the server 
5. Open your browser and enter localhost


## Documentation
The game is using WebSockets for consistent communication with the server and the client.

### Server Events
| socket.on | parameters | outcome |
| --- | --- | --- |
| ```queue player```   |                    | Puts the player into a queue. When another player joins, it will start the game. |
| ```queue computer``` |                    | Starts the game with a computer. |
| ```login register``` | username, password | Login Authentication, if the username exists, it will check whether the password matches, otherwise it will create a new account with the given name and password. |
| ```make move```      | symbol, button     | Saves the move in a database and then emits it to the socket and their opponent |
| ```finish game```    |                    | Emits to the socket and their opponent that the game is tied. |
| ```disconnect```     |                    | Removes the socket from the queue, if they are in one. If they are in a game, it will emit an event to their opponent that they've left. |

### Client Events
| socket.on | parameters | outcome |
| --- | --- | --- |
| ```login successful```   | username | Hides the login panel and displays the play buttons. | 
| ```login failed```       |          | Shows the player that their password is incorrect. |
| ```opponent left```      |          | Displays the play buttons and informs the socket that their opponent has left. |
| ```game started```       | symbol   | Starts the game against a player. |
| ```game with computer``` |          | Starts the game against a computer. |
| ```game tied```          |          | The game is a tie. |
| ```update game```        | symbol, button | Updates the board, also checks if any player has won. |
