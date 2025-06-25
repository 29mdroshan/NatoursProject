import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/Models/Entity/User';
import { UserResponse } from 'src/app/Models/Reponse/UserResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

   constructor(public _http:HttpClient) { }
  
    url='http://localhost:4500/api/v1/user/updateMe'

   updateUser(userData: Partial<User>, updatedUserPhoto: any): Observable<UserResponse> {
     const formData = new FormData();

      // Append name and email data to FormData
     if (userData.name) {
        formData.append('name', userData.name);
      }
      
      if (userData.email) {
        formData.append('email', userData.email);
      }

      if (updatedUserPhoto) {
        console.log('Updated User Photo:', updatedUserPhoto);
        formData.append('photo', updatedUserPhoto, updatedUserPhoto.name); ;
      }
     return this._http.patch<UserResponse>(this.url, formData, { withCredentials: true });
   }
}
