import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
