import * as dotenv from 'dotenv';
import * as express from 'express';
import { createServer } from 'http';
import * as WebSocket from 'ws';
import { connect, Query } from 'mongoose';
import { Patient } from './database/patient';
import { SocketData } from './database/socketData.model';
import * as patientActions from './database/patient.actions';
dotenv.config();
const PORT = process.env.PORT || 1234;
const app = express();
const HTTPserver = createServer(app);
const wsServer = new WebSocket.Server({ server: HTTPserver });
app.use(express.json()); //❌

interface ExtWebSocket extends WebSocket {
  isAlive: boolean;
}
// ------------
connect(process.env.DB_URL as string, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
  if (err) throw err;
  console.log('🔵 Database Connected!');

  // ------------
  wsServer.on('connection', (ws: ExtWebSocket) => {
    // set connection as 'alive'
    ws.isAlive = true;
    ws.on('pong', () => ws.isAlive = true);

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
  Patient.watch().on('change', () => {
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

const triggerAction = (wsData: SocketData): Promise<any> | Query<any, any> | undefined => {
  console.log('🟡 event detected-> ', wsData.type);
  const { data, type: eventType } = wsData;
  if (eventType === 'add-patient') return patientActions.addPatient(data);
  else if (eventType == 'get-patients') return patientActions.getPatients();
  else if (eventType == 'remove-patient') return patientActions.removePatients(data);
  else if (eventType === 'message-patient' || 'set-patient-in-session' || 'set-patient-out-session') return patientActions.editPatient(data);
}
