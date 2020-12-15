import { Component, OnInit } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-staff-actions',
  templateUrl: './staff-actions.component.html',
  styleUrls: ['./staff-actions.component.css']
})
export class StaffActionsComponent implements OnInit {

  constructor(private patientService: PatientService,) { }

  ngOnInit(): void {
  }
  setMsgPatient(): void {
    this.patientService.setMsgPatient(undefined);
  }
}
