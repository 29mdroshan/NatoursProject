import { User } from "../Entity/User";

export class UserResponse {
    constructor(public status: string,
        public data: {
          user:User;
        }
    ){}
}