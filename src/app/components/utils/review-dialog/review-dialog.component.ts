import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.css']
})
export class ReviewDialogComponent {
  reviewText = '';
  rating: number  = 0;

  constructor(
    public dialogRef: MatDialogRef<ReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  submitReview(): void {
    this.dialogRef.close({ review: this.reviewText, rating: this.rating, tourId: this.data.tourId, bookingId : this.data.bookingId});
  }

  cancel(): void {
    this.dialogRef.close();
  }
  deleteReview(): void {
    this.dialogRef.close({ delete: true, tourId: this.data.tourId, bookingId : this.data.bookingId });
  }

}
