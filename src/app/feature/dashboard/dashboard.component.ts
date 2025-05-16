import { Component } from "@angular/core";
import { UserState } from "../../state/user/userState.component";
import { Router } from "@angular/router";

@Component({

    selector: "dashboard-app",
    standalone: true,
    imports: [],
    templateUrl:"./dashboard.component.html",
    styleUrl: "./dashboard.component.scss"
})
export class DashboardComponent{

    isLogout:boolean = false;
    username:string;

    constructor(private userState:UserState, private router:Router){

        this.username = this.userState.user();
    }

    confirm(){

        if(confirm("Want to log out ?")){

            this.userState.updateUser("",false);
            
            localStorage.clear();

            this.router.navigateByUrl("/home");
        }
    }
}