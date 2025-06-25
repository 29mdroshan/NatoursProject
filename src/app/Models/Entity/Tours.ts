import { User } from "./User";

export class Tours{
    constructor(
        public name:string, public duration:number,  public maxGroupSize:Number,
        public difficulty:string, public ratingsAverage:number, public ratingsQuantity:number,
        public price:number, public priceDiscount:number, public summary:string, public description:string,
        public imageCover:string, public images:string[], public createdAt:Date, public startDates:Date[],
        public startLocation:{type:string, coordinates:number[], address:string, description:string},
        public locations:{type:string, coordinates:number[], address:string, description:string, day:number}[],
        public guides:User[]){}
}