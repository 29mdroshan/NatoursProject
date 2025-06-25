import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReviewResponse } from 'src/app/Models/Reponse/ReviewResponse';
import { UpdateReview } from 'src/app/Models/Request/UpdateReview';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:4500/api/v1/review/';
  
    constructor(public _http:HttpClient) { }
  
    fetchMyReview():Observable<ReviewResponse> {
      return this._http.get<ReviewResponse>(this.apiUrl + 'me', { withCredentials: true });
    }

    updateMyReview(reviewId:String, updatedReview: UpdateReview): Observable<ReviewResponse> {
      return this._http.patch<ReviewResponse>(`${this.apiUrl}/${reviewId}`, updatedReview, { withCredentials: true });
    }

    deleteMyReview(reviewId:String): Observable<void> {
      return this._http.delete<void>(`${this.apiUrl}/${reviewId}`, { withCredentials: true });
    }
}
