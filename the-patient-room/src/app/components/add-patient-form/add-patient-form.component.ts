import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-add-patient-form',
  templateUrl: './add-patient-form.component.html'
})
export class AddPatientFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: Router
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0); // scrolls to top to ensure best view of form
  }

  //? form fields and validation
  addPatient = this.fb.group({
    firstname: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
  });

  //? what occurs when form is submitted
  onSubmit(): void {
    this.patientService.addPatient(this.addPatient.value); // trigger to add patient based on form values
    this.route.navigate(['staff-room']); // navidates away from the form
  };

  //? returns false in case of an invalid form to trigger error messages
  validity(criteria: string): boolean {
    return this.addPatient.controls[criteria].touched && this.addPatient.controls[criteria].status === 'INVALID';
  };
}
