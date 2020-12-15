//* THESE INTERFACES WERE MADE FOR ERROR-PREVENTION
// SEPARATE FOR BETTER READABILITY - ALPHABETICALLY SORTED

import { PatientInterface } from './patient';
import * as WebSocket from 'ws';

//? created to test WebSocket connection
export interface ExtWebSocket extends WebSocket {
    isAlive: boolean;
}

//? created to avoid typos and bad data-formatting
export interface SocketData {
    type: 'add-patient' |
    'get-patients' |
    'message-all-patients' |
    'message-patient' |
    'remove-patient' |
    'set-patient-in-session' |
    'set-patient-out-session' |
    'undo-message-patient' |
    'undo-message-all-patients';

    data: PatientInterface |
    PatientInterface[] |
    PatientInterface['id'] |
    PatientInterface['message'];
}
