import { Component, Input, OnInit } from '@angular/core';
import { Patient } from './../../../models/patient.model';
import { PatientService } from './../../services/patient.service';

@Component({
  selector: 'app-patient-monitor',
  templateUrl: './patient-monitor.component.html',
  styleUrls: ['./patient-monitor.component.css']
})
export class PatientMonitorComponent implements OnInit {
  @Input() patients: Patient[];
  @Input() staff: boolean;
  called: number;

  constructor(
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
  }

  callPatient(patientID: number | string): void {
    this.patientService.callPatient(patientID);
  }

  endSession(patientID: number | string): void {
    this.patientService.endSession(patientID);
  }

  setMsgPatient(patientID: number | string): void {
    this.patientService.setMsgPatient(patientID);
  }
}
