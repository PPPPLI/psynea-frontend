import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {environment} from "../../../environnment/environnement"
import { Observable, tap } from "rxjs";
import { ResponseDto } from "../../model/model";

@Injectable({

    providedIn:"root"
})
export class LoginService{

    baseUrl:string = environment.apiUrl;

    header = new HttpHeaders({

        "Content-Type":"application/json"
    })

    constructor(private httpClient:HttpClient){}

    auth(url:string, data:string):Observable<HttpResponse<ResponseDto>>{

        return this.httpClient.post<ResponseDto>(this.baseUrl+url,data,{observe:"response",headers:this.header,responseType:"json"})
            .pipe(
                tap({
                    error(err) {
                        
                        console.log(err)
                    },
                })
            )
    }
}