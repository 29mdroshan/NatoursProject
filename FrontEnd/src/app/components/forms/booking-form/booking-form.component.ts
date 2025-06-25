import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from 'src/app/Models/Entity/Booking';
import { BookingServiceService } from 'src/app/service-layer/booking/booking-service.service';
import { ToursServiceService } from 'src/app/service-layer/tour/tours-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {
  userName: any = "";
  userEmail: any = "";
  bgImageUrl: any = "/assets/img/tours/";
  tour?: any;
  tourName?: any;
  tourImageCover?: any = "loading.jpg";
  date1?:any;
  options?:any;
  formattedDate?:any;
  price?:any;
  guest?:any = 1;
  fair?: any;
  maxGuests: number = 1; 
  date: any = '';

  constructor(public _route: ActivatedRoute, public _tourClient: ToursServiceService, public _bookingClient: BookingServiceService, private _router: Router) {
      this.userName = sessionStorage.getItem('user-name') || '';
      this.userEmail = sessionStorage.getItem('user-email') || '';
  }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        const id = params['id']
        this._tourClient.fetchTourById(id).subscribe(
          data => {
            this.tour = data.data.data;
            this.bgImageUrl += this.tour.imageCover;
            this.tourName = this.tour.name;
            this.price = this.tour.price;
            this.fair = this.price;
            this.maxGuests = this.tour.maxGroupSize;
            this.date1 = new Date(this.tour.startDates[0]);
            this.options = { year: 'numeric', month: 'long' };
            this.formattedDate = this.date1.toLocaleDateString('en-US', this.options);
          }
        )
      }
    )
  }

  calculateTotalPrice() {
    this.fair = this.price * this.guest;
  }

  minDate = new Date().toISOString().split('T')[0];

  onSubmit(booking: Booking) {
    this._bookingClient.createBooking(booking, this.tour.id).subscribe(data => {
      Swal.fire({
        title: 'Booking Successful',
        text: 'Your booking has been successfully booked.',
        icon: 'success',
        confirmButtonText: 'OK'   
      }).then(() => {
        this._router.navigate(['']);
      });
    });
  }

}
