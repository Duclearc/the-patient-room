import { Component, OnInit } from '@angular/core';
import { Patient } from './../../../models/patient.model';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from './../../services/patient.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  patients: Patient[];
  staff = false;
  room = this.staff ? 'Staff' : 'Patient';
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

}
