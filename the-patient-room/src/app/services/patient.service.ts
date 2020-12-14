import { Injectable } from '@angular/core';
import { Patient } from './../../models/patient.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebsocketService } from './websocket.service';

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

  getPatients(): void {
    this.ws.wsRequest(
      null,
      'get-patients',
    );
    this.ws.getSocket()
      .subscribe(socket$ => {
        if (socket$.type === 'get-patients') {
          this.patients = socket$.data as Patient[];
          this.updatedPatients$.next([...this.patients]);
        }
      });
  }
  getPatientsListener(): Observable<Patient[]> {
    return this.updatedPatients$.asObservable();
  }
  callPatient(patientID: number | string): void {
    this.patients.find(patient => patient.id === patientID).in_session = true;
    this.ws.wsRequest(
      this.patients.find(patient => patient.id === patientID),
      'set-patient-in-session'
    );
  }
  endSession(patientID: number | string): void {
    this.patients.find(patient => patient.id === patientID).in_session = false;
    this.ws.wsRequest(
      this.patients.find(patient => patient.id === patientID),
      'set-patient-out-session'
    );
    this.removePatient(patientID);
  }
  removePatient(patientID) {
    this.patients = this.patients.filter(p => p.id !== patientID);
    //  call to db (via WS) to delete patient
    this.ws.wsRequest(
      patientID,
      'remove-patient'
    );
    this.updatedPatients$.next([...this.patients]);
  }
  addPatient(data) {
    const now = new Date().toLocaleString('de-de');
    const newPatient: Patient = {
      id: Math.round(Math.random() * 100 + 1),
      firstname: data.firstname,
      lastname: data.lastname,
      created: now,
      in_session: false,
      messsage: '',
    }
    this.patients.push(newPatient)
    this.updatedPatients$.next([...this.patients]);
    this.ws.wsRequest(
      newPatient,
      'add-patient'
    );
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
  sendMsg2Patient(msg: string) {
    this.patients.find(p => p.id == this.msgPatient.id).messsage = msg;
    const editedPatient: Patient = {
      ...this.msgPatient,
      messsage: msg,
    }
    this.ws.wsRequest(
      editedPatient,
      'message-patient'
    );
    this.updatedPatients$.next([...this.patients]);
    this.msgPatient = undefined;
  }
  send2AllPatients(msg) {
    this.patients.forEach(p => p.messsage = msg);
    this.ws.wsRequest(
      this.patients,
      'message-all-patients'
    );
    this.updatedPatients$.next([...this.patients]);
  }
}
