import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientMonitorComponent } from './components/patient-monitor/patient-monitor.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RoomComponent } from './components/room/room.component';
import { AddPatientFormComponent } from './components/add-patient-form/add-patient-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientMessageFormComponent } from './components/patient-message-form/patient-message-form.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientMonitorComponent,
    NavbarComponent,
    RoomComponent,
    AddPatientFormComponent,
    PatientMessageFormComponent
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
