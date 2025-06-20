import { Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({
    providedIn:"root"
})
export class TestState{

    anwsers:WritableSignal<Array<string>> = signal(new Array(0));

    reinitialAnwsers(capacity:number){

        this.anwsers = signal(new Array(capacity));
    }

    writeAnwser(ans:string, index:number){

        this.anwsers.update((prev) => {
            const newArr = [...prev];
            newArr[index] = ans;
            return newArr;
        });
    }
    
}