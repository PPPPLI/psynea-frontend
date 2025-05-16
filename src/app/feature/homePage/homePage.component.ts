import { UpperCasePipe } from "@angular/common";
import { Component} from "@angular/core";
import { RouterLink } from "@angular/router";
import { UserState } from "../../state/user/userState.component";

@Component({

    selector:"app-home",
    imports: [UpperCasePipe, RouterLink],
    standalone: true,
    styleUrl:"./homePage.component.scss",
    templateUrl:"./homePage.component.html"
})
export class HomePageComponent{

    username:string;
    isLogin:boolean;
    isLogout:boolean = false;

    constructor(private userState:UserState){

        this.username = this.userState.user();
        this.isLogin = this.userState.isLogin;

        console.log(this.isLogin)

    }

    activeLogout(){

        if(this.isLogin){

            this.isLogout = !this.isLogout;
        }
    }
}