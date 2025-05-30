import { Component } from "@angular/core";
import { LoginBannerComponent } from "../../shared/ui/login-banner/login-banner.component";


@Component({

    selector: "dashboard-app",
    standalone: true,
    imports: [LoginBannerComponent],
    templateUrl:"./dashboard.component.html",
    styleUrl: "./dashboard.component.scss"
})
export class DashboardComponent{

}