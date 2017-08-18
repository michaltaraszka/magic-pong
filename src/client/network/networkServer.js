const Peer = require("peerjs");

class NetworkServer {

    constructor() {
        this.login = null;
        this.clientList = [];
        this.init();
    }

    init() {
        Peer.on('connection', (connection) => {
            this.clientList.push(connection);
            console.log("Connection from client with id: ${connection.peer}")
        });
    }

    update(game) {
        this.clientList.forEach((client) => {
            client.dataConnection.send({
                player1: {
                    y: game.player1.y
                },
                player2: {
                    y: game.player2.y
                },
                ball: {
                    x: game.ball.x,
                    y: game.ball.y,
                    direction: game.ball.direction
                }
            });
        });
    }

    addClient(dataConnection) {
        this.clientList.push({
            id: dataConnection.peer,
            dataConnection
        })
    }

    updateClient() {

    }



    removeClient() {

    }
}

module.exports = NetworkServer;