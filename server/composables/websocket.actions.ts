//* AUXILIARY FUNCTIONS
// ALPHABETICALLY SORTED WHEREVER POSSIBLE
// (* = 'more explanation in the NOTES.md'; WS = 'WebSocket'; DB = 'Database')

//? imports - alphabetically sorted by path
import { PatientInterface } from '../database/patient';
import { ExtWebSocket, SocketData } from '../database/socketData.model';
import * as patientActions from './patient.actions';
import * as WebSocket from 'ws';

//? sends data as a response to all connected WS clients
export const socketRES = (wsData: SocketData, wsServer: WebSocket.Server) => wsServer.clients.forEach(client => client.send(JSON.stringify(wsData)));

//? triggers the appropriate DB action according to 'type' attribute*
export const triggerAction = (wsData: SocketData) => {
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
export const wsConnectionCheck = (wsServer: WebSocket.Server) => {
  setInterval(() => {
    wsServer.clients.forEach((ws: WebSocket) => {
      const extWS = ws as ExtWebSocket;
      if (!extWS.isAlive) return ws.terminate(); // if connection is dead, terminate the session
      extWS.isAlive = false;
      ws.ping(null, undefined);
    });
  }, 5000);
};