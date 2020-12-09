import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomPatientComponent } from './components/room-patient/room-patient.component';
import { RoomStaffComponent } from './components/room-staff/room-staff.component';

const routes: Routes = [
  {
    path: 'patient-room',
    component: RoomPatientComponent,
  },
  {
    path: 'staff-room',
    component: RoomStaffComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
