import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Patient } from 'src/models/patient.model';
import { SocketData } from 'src/models/socketData.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  //? properties
  msgPatient: Patient;
  patients: Patient[];
  private updatedPatients$ = new BehaviorSubject<Patient[]>([]);
  updatedMsgPatient$ = new BehaviorSubject<Patient>(undefined);

  constructor(private ws: WebsocketService) { }

  //? adds patient
  addPatient(data: { firstname: string, lastname: string }) {
    const now = new Date().toLocaleString('de-de');
    const newPatient: Patient = { // sets up default patient obj for DB
      id: Math.round(Math.random() * 100 + 1),
      firstname: data.firstname,
      lastname: data.lastname,
      created: now,
      in_session: false,
      message: '',
      room: '',
    };
    this.patients.push(newPatient); // updates locally
    this.ws.wsRequest( // calls to DB (via WS) to add patient
      newPatient,
      'add-patient'
    );
    this.updatePatients();
  };

  //? sets patient as 'in session'
  callPatient(patientID: Patient['id'], room: Patient['room']): void {
    const targetPatient = { // sets up patient obj for DB
      ...this.patients.find(patient => patient.id === patientID),
      in_session: true,
      room: room,
    };
    this.ws.wsRequest( // calls to DB (via WS) to update patient
      targetPatient,
      'set-patient-in-session'
    );
    this.updatePatients();
  };

  //? sets patient as 'out of session'
  endSession(patientID: Patient['id']): void {
    const targetPatient = { // sets up patient obj for DB
      ...this.patients.find(patient => patient.id === patientID),
      in_session: false,
      room: '',
    };
    this.ws.wsRequest( // calls to DB (via WS) to update patient
      targetPatient,
      'set-patient-out-session'
    );
    this.updatePatients();
  };

  //? returns the target patient to receive the message
  getMsgPatient() {
    return this.updatedMsgPatient$.asObservable();
  };

  //? returns the patients stored in DB
  getPatients(): void {
    this.ws.wsRequest( // calls to DB (via WS) to refresh 'patients'
      null,
      'get-patients',
    );
    this.ws.getSocket() // connects to socket
      .subscribe((socket$: SocketData) => {
        if ( // only plays chime if event calls for patient's attention
          socket$.type === 'message-all-patients' ||
          socket$.type === 'message-patient' ||
          socket$.type === 'set-patient-in-session'
        ) {
          this.playChime();
        };
        if (socket$.type === 'get-patients') { // refreshes local 'patients' array according to DB data
          this.patients = socket$.data as Patient[];
          this.sortByInSession(); // pushes 'in session' patients to the top of the display
          this.updatedPatients$.next([...this.patients]); // triggers dependencies refresh on changes
        };
      });
  };

  //? returns the updated patients list
  getPatientsListener(): Observable<Patient[]> {
    return this.updatedPatients$.asObservable();
  };

  //? plays chime
  private playChime() {
    const audio = new Audio();
    audio.src = "./../../assets/chime.mp3";
    audio.load();
    audio.play();
  };

  //? removes patient from list
  removePatient(patientID: Patient['id']) {
    this.patients = this.patients.filter(p => p.id !== patientID); // filters undesired patient out
    this.ws.wsRequest( // calls to DB (via WS) to delete patient
      patientID,
      'remove-patient'
    );
    this.updatePatients();
  };

  //? updates message in target patient
  sendMsg2Patient(msg: Patient['message'], eventType: SocketData['type']) {
    this.patients.find(p => p.id == this.msgPatient.id).message = msg;
    const editedPatient: Patient = {
      ...this.msgPatient,
      message: msg,
    };
    this.ws.wsRequest( // calls to DB (via WS) to update patient's message
      editedPatient,
      eventType
    );
    this.updatePatients();
    this.msgPatient = undefined; // resets messages target patient
  };

  //? updates message in all patients
  send2AllPatients(msg: Patient['message'], eventType: SocketData['type']) {
    this.patients.forEach(p => p.message = msg);
    this.ws.wsRequest( // calls to DB (via WS) to update all patients' message
      msg,
      eventType
    );
    this.updatePatients();
  };

  //? sets the target patient to receive the message
  setMsgPatient(patientID: Patient['id']) {
    if (patientID) this.msgPatient = this.patients.find(p => p.id === patientID); // if individual, set it as target
    else this.msgPatient = undefined; // else, target all patients
    this.updatedMsgPatient$.next(this.msgPatient); // triggers dependencies refresh on changes
  };

  //? moves 'in session' patients to the top
  private sortByInSession() {
    return this.patients.sort((thisP, prevP) => +prevP.in_session - +thisP.in_session);
  };

  //? triggers an update of the patients' state*
  updatePatients() {
    setTimeout(() => this.getPatients(), 50);
  };
}
