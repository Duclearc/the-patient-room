import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-message-form',
  templateUrl: './patient-message-form.component.html',
  styleUrls: ['./patient-message-form.component.css']
})
export class PatientMessageFormComponent implements OnInit {
  patientName = 'Patient'

  constructor(
    private router: Router,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
  }

  onSubmit(msgPatient: NgForm) {
    if (msgPatient.invalid) { return; }
    console.log(msgPatient.value);
  }
}
