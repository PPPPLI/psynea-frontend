import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({

    selector:"header-app",
    imports: [RouterLink, RouterLinkActive],
    standalone: true,
    templateUrl : "./header.component.html",
    styleUrl: "./header.component.scss"
})
export class HeaderComponent{}