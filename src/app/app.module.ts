import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Importer ReactiveFormsModule

import { AppComponent } from './app.component';
//import { PatientDashboardComponent } from './patient/components/patient-dashboard.component';
//import { PatientFormComponent } from './patient/components/patient-form.component';
//import { PatientChartComponent } from './patient/components/patient-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    PatientDashboardComponent,
    PatientFormComponent,
    PatientChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule  // Assurez-vous d'importer ReactiveFormsModule ici
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
