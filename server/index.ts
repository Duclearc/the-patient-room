//* HERE IS THE WEBSOCKET AND MONGOOSE SETUP LIVE (AKA: WHERE THE BACKEND MAGIC HAPPENS)
// ALPHABETICALLY SORTED WHEREVER POSSIBLE
// (* = 'more explanation in the NOTES.md'; WS = 'WebSocket'; DB = 'Database')

//? imports - alphabetically sorted by path
import { socketRES, triggerAction, wsConnectionCheck } from './composables/websocket.actions';
import { PatientModel } from './database/patient';
import { ExtWebSocket, SocketData } from './database/socketData.model';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { createServer } from 'http';
import { connect } from 'mongoose';
import * as WebSocket from 'ws';

//? setup
dotenv.config(); // allows access to dotenv files
const app = express(); // sets up express app
const PORT = process.env.PORT || 1234; // specifies port
const HTTPserver = createServer(app); // creates http basic server
const wsServer = new WebSocket.Server({ server: HTTPserver }); // creates basic WS server based on HTTPserver
app.use(express.json()); // express app handles JSON data

//? connects to DB
connect(process.env.DB_URL as string, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
  if (err) throw err;
  console.log('🔵 Database Connected!');

  //? connects to WS
  wsServer.on('connection', (ws: ExtWebSocket) => {
    // setup for connection check
    ws.isAlive = true; // set connection as 'alive'
    ws.on('pong', () => ws.isAlive = true); // returns isAlive when triggered

    //? what to do when 'message' gets triggered*...
    ws.on('message', (frontendData: string) => {
      const wsData = JSON.parse(frontendData) as SocketData; // formats data
      console.log('🔹 received -> ', frontendData);

      (triggerAction(wsData) as Promise<any>) // triggers appropriate action
        .then(resData => socketRES({ ...wsData, data: resData }, wsServer)); // sends response to frontend
    });

    console.log('🔵 A new Client has connected'); //* alerts for my peace of mind...

    //? notify in case of errors
    ws.on('error', err => {
      console.warn(`🔴 Client disconnected - reason: ${err}`);
    });
  });

  //? notifies when DB gets tampered with
  PatientModel.watch().on('change', () => { //* alerts for my peace of mind...
    console.log('🟡 DB has been altered');
  });
});

HTTPserver.listen(PORT, () => console.log('🔵 Server has started and runs on port: ' + PORT));

//? check connection is still 'alive' every 5s
wsConnectionCheck(wsServer);