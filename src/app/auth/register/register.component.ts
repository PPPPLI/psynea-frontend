import { Component, ElementRef} from "@angular/core";
import { CardComponent } from "../../shared/ui/card/card.component";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { PopupComponent } from "../../shared/ui/pop-up/popup.component";
import {User, Warning} from "../../model/model"
import { LoginService } from "../../core/service/loginService";

@Component({

    selector:"register-app",
    imports: [CardComponent,RouterLink, ReactiveFormsModule, CommonModule, PopupComponent],
    standalone:true,
    templateUrl:"./register.component.html",
    styleUrl:"./register.component.scss"
})
export class RegisterComponent{


    warningMessage:string = Warning.SUCCESS;
    bgColor!:string;
    showWarning:boolean = false;

    invalidFields:Array<HTMLElement> = [];

    constructor(private formBuild:FormBuilder, private elementRef:ElementRef, private loginService:LoginService,
        private router: Router
    ){}

    formGroup = this.formBuild.group({

        username:["",[Validators.required,Validators.minLength(6)]],
        password:["",[Validators.required,Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[^A-Za-z\\d])[A-Za-z\\d\\W]{8,}$")]],
        email:["",[Validators.required,Validators.email]],
        tel:[""]
    })

    createAccount(){

        if(this.invalidFields.length != 0){

            this.invalidFields = [];
        }

        if(!this.formGroup.valid){

        
            this.warningMessage = Warning.INVALID_MESSAGE;
            this.bgColor = "bg-red-400";
            this.showWarning = true;

            setTimeout(() => {
                
                this.showWarning = false;

            }, 3000);


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
                password:ele.password!,
                email:ele.email!,
                tel:ele.tel!
            }

            const data = JSON.stringify(user);

            this.loginService.auth("/auth/register",data).subscribe({

                next:(res) => {

                    if(res.status === 200){

                        const response = res.body;

                        const data = response!.data as string;

                        this.router.navigate(["/login"],{

                            state: {flag: true}
                        })

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