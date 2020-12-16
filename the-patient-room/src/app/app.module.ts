import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddPatientFormComponent } from './components/add-patient-form/add-patient-form.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PatientMessageFormComponent } from './components/patient-message-form/patient-message-form.component';
import { PatientMonitorComponent } from './components/patient-monitor/patient-monitor.component';
import { RoomComponent } from './components/room/room.component';
import { StaffActionsComponent } from './components/staff-actions/staff-actions.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientMonitorComponent,
    NavbarComponent,
    RoomComponent,
    AddPatientFormComponent,
    PatientMessageFormComponent,
    StaffActionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
