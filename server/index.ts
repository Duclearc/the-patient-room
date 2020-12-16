//* HERE IS THE WEBSOCKET AND MONGOOSE SETUP LIVE (AKA: WHERE THE BACKEND MAGIC HAPPENS)
// ALPHABETICALLY SORTED WHEREVER POSSIBLE
// (WS = 'WebSocket'; DB = 'Database')

//? imports - alphabetically sorted by path
import { PatientModel, PatientInterface } from './database/patient';
import * as patientActions from './database/patient.actions';
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

    // now that it's connected, send message...
    ws.on('message', (frontendData: string) => {
      // format data
      const wsData = JSON.parse(frontendData) as SocketData;
      console.log('🔹 received -> ', frontendData);
      // trigger appropriate action
      (triggerAction(wsData) as Promise<any>)
        // send response to frontend
        .then(resData => socketRES({ ...wsData, data: resData }));
    });
    // alerts for my peace of mind...
    // ws.send('🔵 WebSocket Server is on!');
    console.log('🔵 A new Client has connected');
    ws.on('error', err => {
      console.warn(`🔴 Client disconnected - reason: ${err}`);
    })
  });
  // -----------
  PatientModel.watch().on('change', () => {
    console.log('🟡 DB has been altered');
  })
}) // * DEL THIS IF db DOESNT WORK

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

HTTPserver.listen(PORT, () => console.log('🔵 Server has started and runs on port: ' + PORT));

const socketRES = (wsData: SocketData) => wsServer.clients.forEach(client => client.send(JSON.stringify(wsData)));

const triggerAction = (wsData: SocketData) => {
  console.log('🟡 event detected-> ', wsData.type);
  const { data, type: eventType } = wsData;
  switch (eventType) {
    case 'add-patient':
      return patientActions.addPatient(data as PatientInterface);
    case 'get-patients':
      return patientActions.getPatients();
    case 'remove-patient':
      return patientActions.removePatient(data as PatientInterface['id']);
    case 'message-all-patients':
      return patientActions.messageAllPatients(data as PatientInterface['message']);
    case 'undo-message-all-patients':
      return patientActions.messageAllPatients(data as PatientInterface['message']);
    case 'message-patient':
      return patientActions.editPatient(data as PatientInterface);
    case 'undo-message-patient':
      return patientActions.editPatient(data as PatientInterface);
    case 'set-patient-in-session':
      return patientActions.editPatient(data as PatientInterface);
    case 'set-patient-out-session':
      return patientActions.editPatient(data as PatientInterface);
    default:
      console.error(`Unknown Event Type: ${eventType}`);
      break;
  }
}