import { Component, OnInit } from '@angular/core';
import { Patient } from './../../../models/patient.model';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from './../../services/patient.service';

@Component({
  selector: 'app-patient-monitor',
  templateUrl: './patient-monitor.component.html',
  styleUrls: ['./patient-monitor.component.css']
})
export class PatientMonitorComponent implements OnInit {
  patients: Patient[];
  staff = false;
  called: number;

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
    this.route.url.subscribe(path => {
      if (path[0].toString().includes('staff')) {
        this.staff = true;
      }
    });
    this.patients = [
      ...this.patientService.getPatients()
    ];
  }

  callPatient(patientID: number | string): void {
    this.patientService.callPatient(patientID);
  }

  endSession(patientID: number | string): void {
    this.patientService.endSession(patientID);
  }
}
