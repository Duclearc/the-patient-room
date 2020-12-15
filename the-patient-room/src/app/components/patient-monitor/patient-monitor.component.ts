import { Component, EventEmitter, Input, OnInit } from '@angular/core';
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
  room: string;
  rooms = ['1', '2', '3', 'Kids', 'Accessibility'];

  constructor(
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
  }

  callPatient(patientID: number, room = this.room): void {
    this.patientService.callPatient(patientID, room);
  }

  endSession(patientID: number): void {
    this.patientService.endSession(patientID);
  }
  removePatient(patientID: number): void {
    this.patientService.removePatient(patientID);
  }

  setMsgPatient(patientID: number): void {
    this.patientService.setMsgPatient(patientID);
  }
  removeMsg(patientID: number): void {
    this.patientService.setMsgPatient(patientID);
    this.patientService.sendMsg2Patient('');
    this.patientService.setMsgPatient(undefined);
  }
  setRoom($event: any) {
    this.room = ($event.target as HTMLOptionElement).value;
  }

}
