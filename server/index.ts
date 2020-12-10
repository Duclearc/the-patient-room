import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const PORT = 1234;
const app = express();
const HTTPserver = http.createServer(app);
const wsServer = new WebSocket.Server({ server: HTTPserver });

interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}
wsServer.on('connection', (ws: ExtWebSocket) => {
    // set connection as 'alive'
    ws.isAlive = true;
    ws.on('pong', () => ws.isAlive = true);

    // send message...
    ws.on('message', (message: string) => {
        console.log('received-> ', message);
        // to all users connected...
        wsServer.clients
            .forEach(client => {
                if (client != ws) {
                    // ...as 'broadcast', if not the sender.
                    client.send(`broadcast-> ${message}`);
                } else {
                    // ...or 'you'. If you sent it.
                    ws.send(`you-> ${message}`);
                }
            });
    });

    ws.send('WebSocket Server is on!');
});
// set connection is still 'alive' every 5s
setInterval(() => {
    wsServer.clients.forEach((ws: WebSocket) => {
        const extWS = ws as ExtWebSocket;
        // if connection is dead, terminate the session
        if (!extWS.isAlive) return ws.terminate();
        extWS.isAlive = false;
        ws.ping(null, undefined);
    });
}, 5000);

HTTPserver.listen(process.env.PORT || PORT, () => console.log('Server has started and runs on port: ' + PORT));
