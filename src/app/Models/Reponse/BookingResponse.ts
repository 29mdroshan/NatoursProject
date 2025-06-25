export class BookingResponse {
    constructor(public status: string,
        public results: number,
        public data: {
          data: [];
        }
    ){}
}