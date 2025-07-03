import { Routes } from '@angular/router';
import { HomePageComponent } from './feature/homePage/homePage.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './feature/dashboard/dashboard.component';
import { ChatbotPageComponent } from './chatbot-page/chatbot-page.component';
//import { ChatbotResultComponent } from './chatbot-result/chatbot-result.component';
//import { PatientDashboardComponent } from './patient/components/patient-dashboard.component';
//import { PatientFormComponent } from './patient/components/patient-form.component';
//import { PatientComponent } from './patient/patient.component';
import { ResultsPageComponent } from './results-page/results-page.component';

export const routes: Routes = [

    {path:"",redirectTo:"/home",pathMatch:"full"},
    {path:"home", component:HomePageComponent,},
    {path:"register",component:RegisterComponent},
    {path:"login",component:LoginComponent},
    {path:"dashboard",component:DashboardComponent},
    {path: 'chatbot', component:ChatbotPageComponent},
    //{path: 'chatbot-result', component: ChatbotResultComponent }
    //{path: "patient/:id/dashboard", component: PatientDashboardComponent},
    //{path: "patient/:id/self-assessment", component: PatientFormComponent},
    //{path: 'patient/:id', component: PatientComponent}
    {path: 'results', component: ResultsPageComponent},
    //{path: '', redirectTo: '/chat', pathMatch: 'full'}
];
