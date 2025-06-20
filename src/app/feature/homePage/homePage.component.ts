import { UpperCasePipe } from "@angular/common";
import { Component} from "@angular/core";
import { RouterLink } from "@angular/router";
import { LoginBannerComponent } from "../../shared/ui/login-banner/login-banner.component";

@Component({

    selector:"app-home",
    imports: [UpperCasePipe,LoginBannerComponent],
    standalone: true,
    styleUrl:"./homePage.component.scss",
    templateUrl:"./homePage.component.html"
})
export class HomePageComponent{


    constructor(){}
}