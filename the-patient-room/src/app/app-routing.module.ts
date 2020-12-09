import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPatientFormComponent } from './components/add-patient-form/add-patient-form.component';
import { PatientMessageFormComponent } from './components/patient-message-form/patient-message-form.component';
import { RoomComponent } from './components/room/room.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'patient-room',
    pathMatch: 'full',
  },
  {
    path: 'patient-room',
    component: RoomComponent,
  },
  {
    path: 'staff-room',
    component: RoomComponent,
    children: [
      {
        path: 'add-patient',
        component: AddPatientFormComponent,
      },
      {
        path: 'message-patient',
        component: PatientMessageFormComponent,
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
