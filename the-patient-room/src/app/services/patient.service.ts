import { Injectable } from '@angular/core';
import { Patient } from './../../models/patient.model';
import * as dummy from './../../dummy';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // patients: Patient[];
  patients: Patient[] = [
    { ...dummy.default.patient },
    { ...dummy.default.patient, id: 2, firstname: 'jack' },
    { ...dummy.default.patient, id: 3, firstname: 'patricia' },
  ];
  private updatedPatients = new BehaviorSubject<Patient[]>([...this.patients]);

  constructor() { }

  getPatients(): Patient[] {
    this.updatedPatients.next([...this.patients]);
    return this.patients;
  }
  getPatientsListener(): Observable<Patient[]> {
    return this.updatedPatients.asObservable();
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
    this.updatedPatients.next([...this.patients]);
  }
  addPatient(data) {
    const now = new Date().toLocaleString()
    const newPatient: Patient = {
      id: Math.round(Math.random() * 100 + 1),
      firstname: data.firstname,
      lastname: data.lastname,
      last_visit: now,
      in_session: false,
    }
    this.patients.push(newPatient)
    this.updatedPatients.next([...this.patients]);
  }
  loadMessageForm(patientID){
    return
  }
}
