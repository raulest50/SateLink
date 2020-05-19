

const WebSocket = require('ws');

// configuracion del servidor websocket
const wss = new WebSocket.Server({ port: 8080 });

exports.set_up = function () {
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
        });
        ws.send('something');
    });
}