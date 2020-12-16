import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck, map } from 'rxjs/operators';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/models/patient.model';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html'
})
export class RoomComponent implements OnInit {
  //? properties*
  patients$: Observable<Patient[]> = this.patientService.getPatientsListener();
  staff$: Observable<boolean> = this.route.data.pipe(pluck('staff'));
  room$ = this.staff$.pipe(map(staff => staff ? 'Staff' : 'Patient'));

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.patientService.getPatients(); // triggers patient update upon re-render
  }
}
