import { Component, Input } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-staff-actions',
  templateUrl: './staff-actions.component.html'
})
export class StaffActionsComponent {
  //? properties
  @Input() patientsExist: boolean;

  constructor(private patientService: PatientService) { }

  //? removes  all messages from every patient
  removeAllMessages(): void {
    this.patientService.send2AllPatients('', 'undo-message-all-patients');
  };

  //? sets the message target as 'All Patients'
  setMsgPatient(): void {
    this.patientService.setMsgPatient(undefined);
  };
}
