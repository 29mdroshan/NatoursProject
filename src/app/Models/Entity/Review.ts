import { Tours } from "./Tours";

export class Review{
    constructor(public review:string, 
        public rating:number, 
        public createdAt:Date, 
        public tour:Tours, 
        public user:{name:string, photo:string},
        public bookingId:string){}
}