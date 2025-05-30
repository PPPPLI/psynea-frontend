import { Injectable } from "@angular/core";
import { environment } from "../../../environnment/environnement";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { tap } from "rxjs";

@Injectable({

    providedIn:"root"
})
export class TestService{

    baseUrl:string = environment.apiUrl;

    header = new HttpHeaders({

        "Content-Type":"application/json"
    })

    constructor(private httpClient:HttpClient){}

    getQuestion(url:string,index:number){

        return this.httpClient.get(this.baseUrl+url+"/"+index,{observe:"body"})
            .pipe(

                tap({

                    error(err) {
                        
                        console.log(err);
                    },
                })
            )
    }
}