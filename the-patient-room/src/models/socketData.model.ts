export interface SocketRequest {
  type: 'add-patient' | 'set-patient-in-session' | 'set-patient-out-session' | 'get-patients';
  data: any;
}

export interface SocketResponse {
  type: 'patients-list';
  data: any[];
}

export interface SocketMessage {
  type: 'add-patient' | 'set-patient-in-session' | 'set-patient-out-session' | 'get-patients' | 'patients-list';
  data: any;
}
