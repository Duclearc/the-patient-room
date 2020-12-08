import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomPatientComponent } from './components/room-patient/room-patient.component';
import { RoomStaffComponent } from './components/room-staff/room-staff.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomPatientComponent,
    RoomStaffComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
