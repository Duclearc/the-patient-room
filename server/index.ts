//* HERE IS THE WEBSOCKET AND MONGOOSE SETUP LIVE (AKA: WHERE THE BACKEND MAGIC HAPPENS)
// ALPHABETICALLY SORTED WHEREVER POSSIBLE
// (* = 'more explanation in the README.md'; WS = 'WebSocket'; DB = 'Database')

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

    //? what to do when 'message' gets triggered*...
    ws.on('message', (frontendData: string) => {
      const wsData = JSON.parse(frontendData) as SocketData; // formats data
      console.log('🔹 received -> ', frontendData);

      (triggerAction(wsData) as Promise<any>) // triggers appropriate action
        .then(resData => socketRES({ ...wsData, data: resData })); // sends response to frontend
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

//* AUXILIARY FUNCTIONS

//? sends data as a response to all connected WS clients
const socketRES = (wsData: SocketData) => wsServer.clients.forEach(client => client.send(JSON.stringify(wsData)));

//? triggers the appropriate DB action according to 'type' attribute*
const triggerAction = (wsData: SocketData) => {
  console.log('🟡 event detected-> ', wsData.type); //* alerts for my peace of mind...
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
  };
};

//? check connection is still 'alive' every 5s
const wsConnectionCheck = (wsServer: WebSocket.Server) => {
  setInterval(() => {
    wsServer.clients.forEach((ws: WebSocket) => {
      const extWS = ws as ExtWebSocket;
      if (!extWS.isAlive) return ws.terminate(); // if connection is dead, terminate the session
      extWS.isAlive = false;
      ws.ping(null, undefined);
    });
  }, 5000);
};

wsConnectionCheck(wsServer);