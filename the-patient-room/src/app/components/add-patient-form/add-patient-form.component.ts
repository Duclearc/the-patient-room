import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-add-patient-form',
  templateUrl: './add-patient-form.component.html',
  styleUrls: ['./add-patient-form.component.css']
})
export class AddPatientFormComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: Router
  ) { }

  addPatient = this.fb.group({
    firstname: ['', [Validators.required, Validators.minLength(3)]],
    lastname: ['', [Validators.required, Validators.minLength(3)]],
  })

  ngOnInit(): void {
  }

  validity(criteria: string): boolean {
    return this.addPatient.controls[criteria].touched && this.addPatient.controls[criteria].status === 'INVALID';
  }
  onSubmit(): void {
    this.patientService.addPatient(this.addPatient.value);
    this.route.navigate(['staff-room']);
  }
}