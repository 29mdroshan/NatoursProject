
export class ReviewResponse {
    constructor(public status: string,
        public results: number,
        public data: {
          review: [];
        }
    ){}
}