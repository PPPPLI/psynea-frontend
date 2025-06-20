import { Component } from "@angular/core";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";
import { UserState } from "../../state/user/userState.component";

@Component({

    selector:"header-app",
    imports: [RouterLink, RouterLinkActive],
    standalone: true,
    templateUrl : "./header.component.html",
    styleUrl: "./header.component.scss"
})
export class HeaderComponent{


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