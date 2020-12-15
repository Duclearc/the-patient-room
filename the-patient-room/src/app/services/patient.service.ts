import { Injectable } from '@angular/core';
import { Patient } from './../../models/patient.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { SocketData } from 'src/models/socketData.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  patients: Patient[];

  private updatedPatients$ = new BehaviorSubject<Patient[]>([]);

  msgPatient: Patient;

  updatedMsgPatient$ = new BehaviorSubject<Patient>(undefined);

  // ------

  constructor(private ws: WebsocketService) { }
  private playChime() {
    const audio = new Audio();
    audio.src = "./../../assets/chime.mp3";
    audio.load();
    audio.play();
  }
  private sortByInSession() {
    return this.patients.sort((thisP, prevP) => +prevP.in_session - +thisP.in_session)
  }
  getPatients(): void {
    this.ws.wsRequest(
      null,
      'get-patients',
    );
    this.ws.getSocket()
      .subscribe(socket$ => {
        if (
          socket$.type === 'message-all-patients' ||
          socket$.type === 'message-patient' ||
          socket$.type === 'set-patient-in-session'
        ) {
            this.playChime();
        }
        if (socket$.type === 'get-patients') {
          this.patients = socket$.data as Patient[];
          this.sortByInSession();
          this.updatedPatients$.next([...this.patients]);
        }
      });
  }
  getPatientsListener(): Observable<Patient[]> {
    return this.updatedPatients$.asObservable();
  }
  callPatient(patientID: number, room: string): void {
    const targetPatient = {
      ...this.patients.find(patient => patient.id === patientID),
      in_session: true,
      room: room,
    };
    this.ws.wsRequest(
      targetPatient,
      'set-patient-in-session'
    );
    this.updatePatients();
  }
  endSession(patientID: number): void {
    const targetPatient = {
      ...this.patients.find(patient => patient.id === patientID),
      in_session: false,
      room: '',
    };
    this.ws.wsRequest(
      targetPatient,
      'set-patient-out-session'
    );
    this.updatePatients();
  }
  removePatient(patientID) {
    this.patients = this.patients.filter(p => p.id !== patientID);
    //  call to db (via WS) to delete patient
    this.ws.wsRequest(
      patientID,
      'remove-patient'
    );
    this.updatePatients();
  }
  addPatient(data) {
    const now = new Date().toLocaleString('de-de');
    const newPatient: Patient = {
      id: Math.round(Math.random() * 100 + 1),
      firstname: data.firstname,
      lastname: data.lastname,
      created: now,
      in_session: false,
      message: '',
      room: '',
    }
    this.patients.push(newPatient)
    this.ws.wsRequest(
      newPatient,
      'add-patient'
    );
    this.updatePatients();
  }
  // MESSAGE PATIENT
  setMsgPatient(patientID: number) {
    if (patientID) this.msgPatient = this.patients.find(p => p.id === patientID);
    else this.msgPatient = undefined;
    this.updatedMsgPatient$.next(this.msgPatient);
  }
  getMsgPatient() {
    return this.updatedMsgPatient$.asObservable();
  }
  sendMsg2Patient(msg: string, eventType: SocketData['type']) {
    this.patients.find(p => p.id == this.msgPatient.id).message = msg;
    const editedPatient: Patient = {
      ...this.msgPatient,
      message: msg,
    }
    this.ws.wsRequest(
      editedPatient,
      eventType
    );
    this.updatePatients();
    this.msgPatient = undefined;
  }
  send2AllPatients(msg: Patient['message'], eventType: SocketData['type']) {
    this.patients.forEach(p => p.message = msg);
    this.ws.wsRequest(
      msg,
      eventType
    );
    this.updatePatients(50);
  }
  updatePatients(time = 10) {
    setTimeout(() => this.getPatients(), time);
  }
}
