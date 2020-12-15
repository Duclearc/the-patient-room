import { Component, Input, OnInit } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-staff-actions',
  templateUrl: './staff-actions.component.html',
  styleUrls: ['./staff-actions.component.css']
})
export class StaffActionsComponent implements OnInit {
  @Input() patientsExist: boolean;
  messageAllCounter = 0;
  constructor(private patientService: PatientService,) { }

  ngOnInit(): void {
  }
  setMsgPatient(): void {
    this.messageAllCounter++;
    this.patientService.setMsgPatient(undefined);
  }
  removeAllMessages(): void {
    this.messageAllCounter--;
    this.patientService.send2AllPatients('', 'undo-message-all-patients');
  }
}
