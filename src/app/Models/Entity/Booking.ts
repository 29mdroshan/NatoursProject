import { Tours } from "./Tours";

export class Booking{
    constructor(public userName:string, 
        public userEmail:string,
        public startDate:Date,
        public numberOfPeople:number,
        public totalPrice:number,
        public tour:Tours,
        public status:string,
        public isUserReviewed:boolean){}
}