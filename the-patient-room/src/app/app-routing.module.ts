import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomPatientComponent } from './components/room-patient/room-patient.component';
import { RoomStaffComponent } from './components/room-staff/room-staff.component';

const routes: Routes = [
  {
    path: 'room/patient',
    component: RoomPatientComponent,
  },
  {
    path: 'room/staff',
    component: RoomStaffComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
