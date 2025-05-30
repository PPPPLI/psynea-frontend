import { Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({
    providedIn:"root"
})
export class UserState{

    user:WritableSignal<string> = signal("")

    isLogin:boolean = false;

    constructor(){

        const token = localStorage.getItem("token-l");

        if(token != null){

            this.user = signal(localStorage.getItem("username")!);
            this.isLogin = true;
        }
    }
    

    updateUser(newUser:string, newState:boolean){

        this.user.set(newUser);
        this.isLogin = newState;
    }
}