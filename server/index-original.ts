// import * as dotenv from 'dotenv';
// import * as express from 'express';
// import {createServer} from 'http';
// import * as WebSocket from 'ws';
// import { connect } from 'mongoose';
// import Patients from './database/patient.model';
// dotenv.config();
// const PORT = process.env.PORT || 1234;
// const app = express();
// const HTTPserver = createServer(app);
// const wsServer = new WebSocket.Server({ server: HTTPserver });
// app.use(express.json()); //❌

// interface ExtWebSocket extends WebSocket {
//     isAlive: boolean;
// }
// // ------------
// connect(process.env.DB_URL as string, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
//     if (err) throw err;
//     console.log('🔵 Database Connected!');

//     // ------------
//     wsServer.on('connection', (ws: ExtWebSocket) => {
//         // set connection as 'alive'
//         ws.isAlive = true;
//         ws.on('pong', () => ws.isAlive = true);

//         // now that it's connected, send message...
//         ws.on('message', (message: string) => {
//             console.log('🔹 received-> ', message);
//             // to all users connected...
//             wsServer.clients
//                 .forEach(client => {
//                     if (client != ws) {
//                         // ...as 'broadcast', if not the sender.
//                         client.send(`broadcast-> ${message}`);
//                     } else {
//                         // ...or 'you'. If you sent it.
//                         ws.send(`you-> ${message}`);
//                     }
//                 });
//         });

//         ws.send('🔵 WebSocket Server is on!');
//         ws.on('error', err => {
//             console.warn(`Client disconnected - reason: ${err}`);
//         })
//     });
//     // -----------
//     Patients.watch().on('change', change => {
//         console.log('🟡 DB has been altered');
//         console.log(change, '<----THIS IS THE CHANGE!!! 🔴')
//     })
// }) // * DEL THIS IF db DOESNT WORK

// wsServer.listen
// // set connection is still 'alive' every 5s
// setInterval(() => {
//     wsServer.clients.forEach((ws: WebSocket) => {
//         const extWS = ws as ExtWebSocket;
//         // if connection is dead, terminate the session
//         if (!extWS.isAlive) return ws.terminate();
//         extWS.isAlive = false;
//         ws.ping(null, undefined);
//     });
// }, 5000);

// HTTPserver.listen(PORT, () => console.log('🔵 Server has started and runs on port: ' + PORT));
