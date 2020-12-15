import { Patient } from './patient.model';

export interface SocketData {
  type: 'add-patient' |
  'set-patient-in-session' |
  'set-patient-out-session' |
  'get-patients' |
  'remove-patient' |
  'message-patient' |
  'message-all-patients' |
  'undo-message-patient' |
  'undo-message-all-patients';
  data: Patient |
  Patient[] |
  Patient['message'] |
  Patient['id'];
}
