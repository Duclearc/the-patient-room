import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-patient-form',
  templateUrl: './add-patient-form.component.html',
  styleUrls: ['./add-patient-form.component.css']
})
export class AddPatientFormComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

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
    console.log(this.addPatient.value);
  }
}
