import * as dotenv from 'dotenv';
import * as express from 'express';
import { createServer } from 'http';
import * as WebSocket from 'ws';
import { connect, Query } from 'mongoose';
import Patient from './database/patient.model';
import { SocketRequest, SocketResponse } from './database/socketData.model';
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
      const { data, type } = JSON.parse(frontendData) as SocketRequest;
      console.log('🔹 received -> ', frontendData);
      console.log('🔹 type -> ', typeof frontendData);
      console.log(data, 'data');
      console.log(type, 'type');
      // trigger appropriate action
      (triggerAction(data, type) as Promise<any>)
        // send response to frontend
        .then(resData => socketRES(resData, type))
    });
    // alerts for my peace of mind...
    // ws.send('🔵 WebSocket Server is on!');
    console.log('🔵 A new Client has connected');
    ws.on('error', err => {
      console.warn(`🔴 Client disconnected - reason: ${err}`);
    })
  });
  // -----------
  Patient.watch().on('change', change => {
    console.log('🟡 DB has been altered');
    console.log(JSON.stringify(change), '<----THIS IS THE CHANGE!!! 🔴')
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

const socketRES = (receivedData: Object, action: string) => {
  wsServer.clients.forEach(client => {
    console.log(`🟡 RES FOR '${action}' SENT`);
    client.send(JSON.stringify({
      // you should put here the type of your message, one of the types as SocketMessage: 'add-patient' | 'set-patient-in-session' | 'set-patient-out-session' | 'get-patient' | 'patients-list' //✅
      type: action, // I'm leaving patients-list for now so you can test if you get it in your patients service
      data: receivedData,
    }));
  });
  console.log(`🟡 NEW ${action} -> ${receivedData}`);
}

const triggerAction = (data: any, eventType: string): Promise<any> | Query<any, any> | undefined => {
  console.log('🟡 event detected-> ', eventType);
  if (eventType === 'add-patient') return patientActions.addPatient(data);
  else if (eventType == 'get-patients') return patientActions.getPatients();
}
