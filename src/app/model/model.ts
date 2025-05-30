export enum Warning{

    INVALID_MESSAGE = "Filed(s) invalid",
    FAIL_REQUEST = "Please try later",
    SUCCESS = "Successfully processed",
    ACCOUNT_CREATED = "Account created successfully"
}

export type User = {

    userId?:string,
    username:string,
    password:string,
    email?:string,
    tel?:string,
    isNewUser?:boolean
}

export type ResponseDto = {

    status:string,
    data:any
}

export type Question = {

    question:string,
    index:number,
    answers: Array<string>
}