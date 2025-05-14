export enum Warning{

    INVALID_MESSAGE = "Filed(s) invalid",
    FAIL_REQUEST = "Please try later",
    SUCCESS = "Successfully processed"
}

export type User = {

    userId?:string,
    username:string,
    password:string,
    email?:string,
    tel?:string
}

export type ResponseDto = {

    status:string,
    data:any
}