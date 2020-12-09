import { Component, OnInit } from '@angular/core';
import { Patient } from './../../../models/patient.model';

@Component({
  selector: 'app-room-staff',
  templateUrl: './room-staff.component.html',
  styleUrls: ['./room-staff.component.css']
})
export class RoomStaffComponent implements OnInit {
  patients: Patient[];

  constructor() { }

  ngOnInit(): void {
  }

}
