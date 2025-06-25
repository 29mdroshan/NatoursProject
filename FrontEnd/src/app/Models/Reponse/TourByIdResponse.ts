import { Tours } from "../Entity/Tours";

export class TourByIdResponse {
    constructor(public status: string,
        public results: number,
        public data: {
          data: Tours;
        }
    ){}
}