const socket = require('socket.io');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" });
let io;

const createSocket = (server) => {
    io = socket(server, {
        cors: { origin: '*' }
    });
    io.on('connection', (socket) => {
        console.log("websocket connection successfully established")
        socket.emit("join-me", "drashti")
        socket.on('disconnect', () => {
            socket.disconnect();
        })
    })
}

function EmitEvent(event, ...data) {
    io.sockets.emit(event, ...data);
}

module.exports = {
    createSocket,
    EmitEvent
}