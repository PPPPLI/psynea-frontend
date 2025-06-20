import { Component, Input } from "@angular/core";

@Component({

    selector:"popup-app",
    imports: [],
    standalone:true,
    templateUrl:"./popup.component.html",
    styleUrl:"./popup.component.scss"
})
export class PopupComponent{

    @Input() bgColor:string = "bg-red-500"
    @Input() message!:string;
}