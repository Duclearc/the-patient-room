import { PatientInterface } from './patient';

export interface SocketData {
    type: 'add-patient' |
    'set-patient-in-session' |
    'set-patient-out-session' |
    'get-patients' |
    'remove-patient' |
    'message-patient' |
    'message-all-patients';
    data: PatientInterface |
    PatientInterface[] |
    PatientInterface['message'] |
    PatientInterface['id'];
}