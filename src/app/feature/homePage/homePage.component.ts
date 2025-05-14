import { UpperCasePipe } from "@angular/common";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({

    selector:"app-home",
    imports: [UpperCasePipe, RouterLink],
    standalone: true,
    styleUrl:"./homePage.component.scss",
    templateUrl:"./homePage.component.html"
})
export class HomePageComponent{}