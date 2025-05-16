import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { UserState } from "../../state/user/userState.component";

@Component({

    selector:"header-app",
    imports: [RouterLink, RouterLinkActive],
    standalone: true,
    templateUrl : "./header.component.html",
    styleUrl: "./header.component.scss"
})
export class HeaderComponent{

    isLogin:boolean;

    constructor(private userState:UserState){

        this.isLogin = this.userState.isLogin;
    }
}