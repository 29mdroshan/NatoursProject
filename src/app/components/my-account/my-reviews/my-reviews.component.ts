import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Booking } from 'src/app/Models/Entity/Booking';
import { BookingServiceService } from 'src/app/service-layer/booking/booking-service.service';
import { ReviewService } from 'src/app/service-layer/review/review.service';
import { ToursServiceService } from 'src/app/service-layer/tour/tours-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.css']
})

export class MyReviewsComponent {

  isOwner: boolean = false;
  isAdmin: boolean = false;

  constructor(private _reviewClient: ReviewService, private _bookingClient: BookingServiceService, private _tourClient: ToursServiceService, public _route: ActivatedRoute) { }

  reviews: any[] = [];
  ngOnInit(): void {
    sessionStorage.getItem("user-role") === "admin" ? this.isAdmin = true : this.isAdmin = false;
    if(sessionStorage.getItem("user-role") === "admin") {
      this._route.params.subscribe(
      params => {
          const id = params['id']
        
          this._tourClient.fetchTourReviewsById(id).subscribe(reviews => {
                this.reviews = reviews.data.data;
          })
      });
      
    } else {
      this._reviewClient.fetchMyReview().subscribe({
        next: (response) => {
          this.reviews = response.data.review;
          if(this.reviews.length > 0) {
            sessionStorage.getItem('userEmail') === this.reviews[0].user.email ? this.isOwner = true : this.isOwner = false;
          }
        },
        error: (error) => {
          console.error("Error fetching reviews: ", error);
        }
      });
    }
    
  }

  updateReview(updated: { id: string; rating: number; review: string }) {
    const review = this.reviews.find(r => r._id === updated.id);
    if (review) {
      if(review.rating !== updated.rating || review.review !== updated.review) {
        this._reviewClient.updateMyReview(updated.id, { review: updated.review, rating: updated.rating }).subscribe({
          next: (response) => {
            this.ngOnInit();
          },
          error: (error) => {
            console.error("Error updating review: ", error);
          }
        });
      }
    }
  }

  deleteReview(event:any) {
    if (confirm('Are you sure you want to delete this review?')) {
      this._reviewClient.deleteMyReview(event.id).subscribe({
        next: (response) => {
          const partialBooking = {isUserReviewed: false} as Partial<Booking>;
          this._bookingClient.updateBookingReviewStatus(event.bookingId, partialBooking).subscribe(
            data => {
              if(data) {
                Swal.fire({
                  title: 'Success',
                  text: 'Review deleted successfully!',
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
              }
            });
          this.ngOnInit();
        },
        error: (error) => {
          console.error("Error deleting review: ", error);
        }
      });
    }
  }
}