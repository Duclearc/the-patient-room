import { Injectable, OnInit } from '@angular/core';
import { Patient } from './../../models/patient.model';
import { SocketMessage, SocketRequest, SocketResponse } from '../../models/socketData.model';
import * as dummy from './../../dummy';
import { BehaviorSubject, Observable } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { map, pluck, filter } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class PatientService implements OnInit {
  patients: Patient[];

  private updatedPatients$ = new BehaviorSubject<Patient[]>([]);

  msgPatient: Patient;

  updatedMsgPatient$ = new BehaviorSubject<Patient>(undefined);

  socket;
  // ------

  constructor(private ws: WebsocketService) { }

  ngOnInit() {

  }

  // getPatients$(): void | Observable<Patient[]> {
  //   return this.ws.getSocket().pipe(
  //     filter((wsData: SocketMessage) => wsData.type === 'patients-list'),
  //     map(wsData => wsData.data),
  //   );
  // }

  getPatients(): void {
    console.log('getPatients()');
    const wsData: SocketRequest = {
      data: '',
      type: 'get-patients'
    }
    this.ws.send(wsData);
    this.ws.getSocket()
      .subscribe(socket$ => {
        this.socket = socket$.data;
        if (socket$.type === 'get-patients') {
          this.patients = this.socket;
          this.updatedPatients$.next([...this.patients]);
        }
      });
      // this.getPatients$();
      console.log(this.patients, 'patients');

  }
  // ------- //
  getPatientsListener(): Observable<Patient[]> {
    return this.updatedPatients$.asObservable();
  }
  callPatient(patientID: number | string): void {
    this.patients.find(patient => patient.id === patientID).in_session = true;
  }
  endSession(patientID: number | string): void {
    this.patients.find(patient => patient.id === patientID).in_session = false;
    this.removePatient(patientID);
  }
  removePatient(patientID) {
    this.patients = this.patients.filter(p => p.id !== patientID);
    //  call to db (via WS) to delete patient //❌
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
    }
    this.patients.push(newPatient)
    this.updatedPatients$.next([...this.patients]);
    const wsData: SocketRequest = {
      data: newPatient,
      type: 'add-patient'
    }
    this.ws.send(wsData);
  }
  // MESSAGE PATIENT
  setMsgPatient(patientID) {
    this.msgPatient = this.patients.find(p => p.id === patientID);
    this.updatedMsgPatient$.next(this.msgPatient);
  }
  getMsgPatient() {
    return this.updatedMsgPatient$.asObservable();
  }
  sendMsg2Patient(msg) {
    this.patients.find(p => p.id == this.msgPatient.id).messsage = msg;
    this.updatedPatients$.next([...this.patients]);
    this.msgPatient = undefined;
  }
  send2AllPatients(msg) {
    this.patients.forEach(p => p.messsage = msg);
    this.updatedPatients$.next([...this.patients]);
  }
}
