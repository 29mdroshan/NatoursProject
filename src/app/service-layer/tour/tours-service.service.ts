import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TourResponse } from '../../Models/Reponse/TourResponse';
import { TourByIdResponse } from '../../Models/Reponse/TourByIdResponse';

@Injectable({
  providedIn: 'root'
})
export class ToursServiceService {

  constructor(public _http:HttpClient) { }

  url='http://localhost:4500/api/v1/tour'

  fetchAllTours():Observable<TourResponse> {
    return this._http.get<TourResponse>(this.url)
  }

  fetchTourById(id:any):Observable<TourByIdResponse> {
    return this._http.get<TourByIdResponse>(this.url+"/"+id,  { withCredentials: true })
  }

  fetchTourReviewsById(id:any):Observable<TourResponse> {
    return this._http.get<TourResponse>(this.url+"/"+id+"/reviews",  { withCredentials: true })
  }

  createTourReview(tourId: string, reviewData: any): Observable<any> {
    return this._http.post<any>(`${this.url}/${tourId}/reviews`, reviewData, { withCredentials: true });
  }
  
}
