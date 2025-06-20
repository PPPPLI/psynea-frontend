import { Component, ElementRef, OnInit } from "@angular/core";
import { CardComponent } from "../../shared/ui/card/card.component";
import { Router, RouterLink } from "@angular/router";
import { PopupComponent } from "../../shared/ui/pop-up/popup.component";
import {User, Warning} from "../../model/model"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LoginService } from "../../core/service/loginService";
import { UserState } from "../../state/user/userState.component";

@Component({

    selector:"login-app",
    imports:[CardComponent,RouterLink,PopupComponent, ReactiveFormsModule, CommonModule],
    standalone:true,
    templateUrl:"./login.component.html",
    styleUrl:"./login.component.scss"
})
export class LoginComponent implements OnInit{

    showWarning:boolean = false;
    warningMessage:string = Warning.INVALID_MESSAGE;
    bgColor!:string;

    invalidFields:Array<HTMLElement> = [];

    constructor(private formBuilder:FormBuilder, private elementRef:ElementRef, private loginService:LoginService,
        private router:Router, private userState:UserState
    ){}

    formGroup = this.formBuilder.group({

        username:["",[Validators.required, Validators.minLength(6)]],
        password:["",[Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W]{8,}$")]]
    })

    ngOnInit(): void {
        
        //Check if an page redirection from Register page (registeration success)
        const nav = history.state

        if(nav.flag != undefined){

            this.showWarningFunc(Warning.ACCOUNT_CREATED,"bg-green-400");
            history.replaceState({},"");
        }


    }

    submit(){

        if(this.invalidFields.length != 0){

            this.invalidFields = [];
        }


        if(!this.formGroup.valid){


            this.showWarningFunc(Warning.INVALID_MESSAGE,"bg-red-400");


            Object.keys(this.formGroup.controls).forEach(ele => {

                const control = this.formGroup.get(ele);
                
                if (control && control.invalid) {
                    
                    let element = this.elementRef.nativeElement.querySelector(`#${ele}`) as HTMLElement

                    element.style.border = "1px red solid";

                    this.invalidFields.push(element);
                }

            })

        }else{

            const ele = this.formGroup.value;

            const user:User = {

                username:ele.username!,
                password:ele.password!
            }

            const data = JSON.stringify(user);

            this.loginService.auth("/auth/login",data).subscribe({

                next:(res) => {

                    if(res.status === 200){

                        const response = res.body;

                        const data = response!.data as Array<string>;

                        //data response includes 1.longterm token, 2.shortterm token, 3.isNewUser status
                        localStorage.setItem("token-l",data[0]);
                        localStorage.setItem("token-s",data[1]);
                        localStorage.setItem("username", ele.username!)
                        localStorage.setItem("isNewUser",data[2])

                        //Change user state
                        this.userState.updateUser(user.username,true)
                        

                        this.formGroup.patchValue({"username":"","password":""})

                        data[2]?this.router.navigateByUrl("/test"):this.router.navigateByUrl("/dashboard");

                    
                    }else{

                        this.showWarningFunc(Warning.FAIL_REQUEST,"bg-red-400");
                    }


                },

                error:() => {

                    this.showWarningFunc(Warning.FAIL_REQUEST,"bg-red-400");
                }
            })


        }
    }


    initializeInput(){

        if(this.invalidFields.length != 0){

            this.invalidFields.forEach(ele => {

                ele.style.border = "1px solid #9333ea";
            })

            this.invalidFields = [];
        }
    }


    showWarningFunc(message:string, color:string,){


        this.warningMessage = message;
        this.bgColor = color;
        this.showWarning = true;

        setTimeout(() => {
            
            this.showWarning = false;

        }, 3000);
    }

}