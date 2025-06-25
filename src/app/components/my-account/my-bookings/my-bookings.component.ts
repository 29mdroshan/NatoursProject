import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Booking } from 'src/app/Models/Entity/Booking';
import { Review } from 'src/app/Models/Entity/Review';
import { ReviewDialogComponent } from 'src/app/components/utils/review-dialog/review-dialog.component';
import { BookingServiceService } from 'src/app/service-layer/booking/booking-service.service';
import { ToursServiceService } from 'src/app/service-layer/tour/tours-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent {

  bookings: Booking[] = [];
  isAdmin: boolean = false;
  constructor(public _bookingClient: BookingServiceService, private _tourClient: ToursServiceService,private dialog: MatDialog) { }

  ngOnInit(): void {
    sessionStorage.getItem("user-role") === "admin" ? this.isAdmin = true : this.isAdmin = false;

    if(this.isAdmin) {
      this._bookingClient.fetchAllBookings().subscribe(
        data => {
          this.bookings = data.data.data;
        },
        error => {
          console.error('Error fetching bookings:', error);
        }
      );
    } else {
      this._bookingClient.fetchMyBookings().subscribe(
        data => {
          this.bookings = data.data.data;
        },
        error => {
          console.error('Error fetching bookings:', error);
        }
      );
    }

  }

   getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed': return 'confirmed';
      case 'pending': return 'pending';
      case 'cancelled': return 'cancelled';
      default: return '';
    }
  }

  onWriteReview(booking: any): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '400px',
      data: {
        tourName: booking.tour.name,
        tourId: booking.tour.id,
        bookingId: booking._id
      }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const partialReview = {rating: result.rating, review: result.review, bookingId: result.bookingId} as Partial<Review>;
      this._tourClient.createTourReview(result.tourId, partialReview).subscribe(
        data => {
          if(data) {
            const partialBooking = {isUserReviewed: true} as Partial<Booking>;
            this._bookingClient.updateBookingReviewStatus(result.bookingId, partialBooking).subscribe(
              data => {
                if(data) {
                  Swal.fire({
                    title: 'Review Submitted',
                    text: 'Your review has been submitted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                  });
                  this.ngOnInit();
                }
              });
          }
        });
      }
    });
  }

}
