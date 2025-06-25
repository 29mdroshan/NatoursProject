
export class TourResponse {
    constructor(public status: string,
        public results: number,
        public data: {
          data: [];
        }
    ){}
}