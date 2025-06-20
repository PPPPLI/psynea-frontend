import { Component } from "@angular/core";
import { LoginBannerComponent } from "../../shared/ui/login-banner/login-banner.component";
import { TestService } from "../../core/service/testService";
import { Question, ResponseDto } from "../../model/model";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TestState } from "../../state/testState.component";

@Component({

    selector:"app-test",
    standalone:true,
    imports: [LoginBannerComponent, ReactiveFormsModule],
    templateUrl:"./test.component.html",
    styleUrl:"./test.component.scss"
})
export class TestComponent{

    testStarted:boolean;
    questionTotal!:number;
    actuelIndex:number;
    question!:string;
    anwsers!:Array<string>;
    group:FormGroup;
    totalQuestionDone:number;

    constructor(private testService:TestService, private builder: FormBuilder,private testState:TestState){

        this.testStarted = false;
        this.actuelIndex = 0;
        this.totalQuestionDone = 0;
        this.group = builder.group({

            ans:[null]
        })
    }



    start(){

        this.testService.getQuestion("/test/question/get",this.actuelIndex).subscribe(res => {
            
            const responseDto = res as ResponseDto;

            if(responseDto.status === "ACCEPTED"){
                
                this.testStarted = true;

                const question = responseDto.data[0] as Question
                this.questionTotal = responseDto.data[1] as unknown as number;

                this.question = question.question;
                this.anwsers = question.answers;
                
                if(this.testState.anwsers().length === 0){

                    this.testState.reinitialAnwsers(this.questionTotal);

                }

                const ansList = this.testState.anwsers();
                const ans = ansList[this.actuelIndex];

                setTimeout(() => {

                    if(ans != null){
                        this.group.patchValue({"ans":ans});
                    }else{

                        this.group.patchValue({"ans":null});
                    }
                    
                }, 10);

            }else{

                console.log(responseDto.status);
            }

        })
    }

    changeQuestion(index:number){

        const value = this.group.value.ans;

        if(value != null){

            this.testState.writeAnwser(value,this.actuelIndex);
        }

        this.actuelIndex += index;


        this.start();

    }

    incrementDoneNumber(){

        if(this.group.value.ans == null){

            this.totalQuestionDone++;
        }
    }
}