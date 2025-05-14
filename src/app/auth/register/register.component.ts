import { Component, ElementRef} from "@angular/core";
import { CardComponent } from "../../shared/ui/card/card.component";
import { RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { PopupComponent } from "../../shared/ui/pop-up/popup.component";
import {Warning} from "../../model/model"

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

    constructor(private formBuild:FormBuilder, private elementRef:ElementRef){}

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

}