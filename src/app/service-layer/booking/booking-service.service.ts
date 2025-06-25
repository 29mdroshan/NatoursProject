import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from 'src/app/Models/Entity/Booking';
import { BookingResponse } from 'src/app/Models/Reponse/BookingResponse';

@Injectable({
  providedIn: 'root'
})
export class BookingServiceService {

  private apiUrl = 'http://localhost:4500/api/v1/bookings';

  constructor(public _http:HttpClient) { }

  fetchMyBookings():Observable<BookingResponse> {
    return this._http.get<BookingResponse>(this.apiUrl, { withCredentials: true });
  }

  fetchAllBookings():Observable<BookingResponse> {
    return this._http.get<BookingResponse>(this.apiUrl+'/all', { withCredentials: true });
  }

  createBooking(booking: Booking, tourId: Number): Observable<Booking> {
    let createBookingUrl = `http://localhost:4500/api/v1/tour/`;
    return this._http.post<Booking>(`${createBookingUrl}/${tourId}/bookings`, booking, { withCredentials: true });
  }

  updateBookingReviewStatus(bookingId:String, booking: Partial<Booking>) : Observable<any> {
    return this._http.patch(`${this.apiUrl}/${bookingId}`, booking, { withCredentials: true });
  }

}
