import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/models/patient.model';

@Component({
  selector: 'app-patient-message-form',
  templateUrl: './patient-message-form.component.html',
  styleUrls: ['./patient-message-form.component.css']
})
export class PatientMessageFormComponent implements OnInit {
  msgPatient: Patient;
  msgPatientSubs: Subscription;
  patientName = 'All Patients';
  msgPatientForm = this.fb.group({
    message: ['', [Validators.required]]
  })

  constructor(
    private router: Router,
    private patientService: PatientService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.msgPatientSubs = this.patientService.getMsgPatient()
      .subscribe((msgP: Patient) => {
        this.msgPatient = msgP;

        if (this.msgPatient) {
          this.patientName = `${this.msgPatient.firstname} ${this.msgPatient.lastname}`
        }
      })
  }

  onSubmit() {
    if (this.msgPatientForm.invalid) { return; }
    if (this.msgPatient) {
      this.patientService.sendMsg2Patient(this.msgPatientForm.value.message);
    } else {
      this.patientService.send2AllPatients(this.msgPatientForm.value.message);
    }
    this.router.navigate(['staff-room']);
  }
}
