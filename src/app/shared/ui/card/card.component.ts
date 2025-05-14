import { UpperCasePipe } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({

    selector:"card-app",
    imports: [UpperCasePipe, RouterLink],
    standalone: true,
    templateUrl: "./card.component.html",
    styleUrl: "./card.component.scss"
})
export class CardComponent{

    @Input() width!:string;
    @Input() height!:string;
    @Input() headerName:string = "Header";
    @Input() headerBg:string = "bg-purple-400";
    @Input() hasbackforward:boolean = false;
}