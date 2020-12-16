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
  //? properties
  msgPatient: Patient;
  msgPatientSubs: Subscription;
  patientName: string;

  constructor(
    private router: Router,
    private patientService: PatientService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    //? gets the target patient to receive the message
    this.msgPatientSubs = this.patientService.getMsgPatient()
      .subscribe((msgP: Patient) => {
        this.msgPatient = msgP;
        if (this.msgPatient) { // if individual, target the form to that patient
          this.patientName = `${this.msgPatient.firstname} ${this.msgPatient.lastname}`
        } else { // else, target message to all patients
          this.patientName = 'All Patients';
        }
      });

    window.scrollTo(0, 0); // scrolls to top to ensure best view of form
  }

  //? form fields and validation
  msgPatientForm = this.fb.group({
    message: ['', [Validators.required]]
  });

  //? what occurs when form is submitted
  onSubmit() {
    if (this.msgPatientForm.invalid) return; // prevents invalid forms from proceeding
    if (this.msgPatient) { // if individual, send message to that patient
      this.patientService.sendMsg2Patient(this.msgPatientForm.value.message, 'message-patient');
    } else { // else, send message to all patients
      this.patientService.send2AllPatients(this.msgPatientForm.value.message, 'message-all-patients');
    }
    this.router.navigate(['staff-room']); // navidates away from the form
  };
}
