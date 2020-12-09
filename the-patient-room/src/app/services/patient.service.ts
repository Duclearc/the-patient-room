import { Injectable } from '@angular/core';
import { Patient } from './../../models/patient.model';
import * as dummy from './../../dummy';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // patients: Patient[];
  patients = [
    { ...dummy.default.patient },
    { ...dummy.default.patient, id: 2 },
    { ...dummy.default.patient, id: 3 },
  ];

  constructor() { }

  getPatients(): Patient[] {
    return this.patients;
  }
  callPatient(patientID: number | string): void {
    this.patients.find(patient => patient.id === patientID).in_session = true;
  }
  endSession(patientID: number | string): void {
    this.patients.find(patient => patient.id === patientID).in_session = false;
  }
}
