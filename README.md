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
4. Type `node index.js` in the command prompt to run the server 
5. Open your browser and enter localhost


## API
The game is using WebSockets for consistent communication with the server and the client.

### Server Events
| socket.on        | 
| ---------------- |
| `queue player`   |
| `queue computer` |
| `login register` |
| `make move`      |
| `finish game`    |
| `disconnect`     |

### Client Events
| socket.on        | 
| ---------------- |
| `queue player`   |
| `queue computer` |
| `login register` |
| `make move`      |
| `finish game`    |
| `disconnect`     |






