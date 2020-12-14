import { Component, OnInit } from '@angular/core';
import { Patient } from './../../../models/patient.model';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from './../../services/patient.service';
import { Observable, Subscription } from 'rxjs';
import { pluck, map } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  patients$: Observable<Patient[]> = this.patientService.getPatientsListener();
  staff$: Observable<boolean> = this.route.data.pipe(pluck('staff'));
  room$ = this.staff$.pipe(map(staff => staff ? 'Staff' : 'Patient'));


  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
  ) { }

  ngOnInit(): void {
    console.log('room calls getPatients()');
    this.patientService.getPatients();
  }
  setMsgPatient(): void {
    this.patientService.setMsgPatient(undefined);
  }
}
