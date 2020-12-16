import { Component, Input } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/models/patient.model';

@Component({
  selector: 'app-patient-monitor',
  templateUrl: './patient-monitor.component.html',
  styleUrls: ['./patient-monitor.component.css']
})
export class PatientMonitorComponent {
  //? properties
  @Input() patients: Patient[];
  @Input() staff: boolean;
  room: Patient['room'];
  rooms = ['1', '2', '3', 'Kids', 'Accessibility'];

  constructor(private patientService: PatientService) { }

  //? sets patient as 'in session'
  callPatient(patientID: Patient['id'], room = this.room): void {
    if (!this.room) return; // prevents calls from proceeding unless a room has been specified
    this.patientService.callPatient(patientID, room);
    this.room = ''; // resets room after a patient has been called
  };

  //? sets patient as 'out of session'
  endSession(patientID: Patient['id']): void {
    this.patientService.endSession(patientID);
  };

  //? removes message associatesd with a patient
  removeMsg(patientID: Patient['id']): void {
    this.patientService.setMsgPatient(patientID); // targets the patient to erase message
    this.patientService.sendMsg2Patient('', 'undo-message-patient'); // triggers message reset
    this.patientService.setMsgPatient(undefined); // removes target patient
  };

  //? removes patient from list
  removePatient(patientID: Patient['id']): void {
    this.patientService.removePatient(patientID);
  };

  //? sets the target patient to receive the message
  setMsgPatient(patientID: Patient['id']): void {
    this.patientService.setMsgPatient(patientID);
  };

  //? sets the room to send patient into
  setRoom($event: any) {
    this.room = ($event.target as HTMLOptionElement).value;
  };
}
