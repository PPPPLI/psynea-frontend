import { Routes } from '@angular/router';
import { HomePageComponent } from './feature/homePage/homePage.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [

    {path:"",redirectTo:"/home",pathMatch:"full"},
    {path:"home", component:HomePageComponent,},
    {path:"register",component:RegisterComponent},
    {path:"login",component:LoginComponent}

];
