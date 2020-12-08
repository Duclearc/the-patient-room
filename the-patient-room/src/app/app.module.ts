import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomPatientComponent } from './components/room-patient/room-patient.component';
import { RoomStaffComponent } from './components/room-staff/room-staff.component';
import { PatientMonitorComponent } from './components/patient-monitor/patient-monitor.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomPatientComponent,
    RoomStaffComponent,
    PatientMonitorComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
