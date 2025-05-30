import { Component } from "@angular/core";
import { UserState } from "../../../state/user/userState.component";
import { Router, RouterLink } from "@angular/router";

@Component({

    selector:"login-banner-app",
    standalone:true,
    imports:[RouterLink],
    templateUrl:"./login-banner.component.html",
    styleUrl:"./login-banner.component.scss"
})
export class LoginBannerComponent{

    isLogout:boolean = false;


    constructor(public userState:UserState, private router:Router){}

    confirm(){

        if(confirm("Want to log out ?")){

            this.userState.updateUser("",false);
            
            localStorage.clear();

            this.isLogout = false;

            this.router.navigateByUrl("/home");
        }
    }

    activeLogout(){

        if(this.userState.isLogin){

            this.isLogout = !this.isLogout;
        }
    }
}