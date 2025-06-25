import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent {

  @Input() review: any;
  isOwner: boolean = false;
  @Input() isAdmin: boolean = false;

  @Output() reviewUpdated = new EventEmitter<{ id: string, rating: number, review: string }>();
  @Output() reviewDeleted = new EventEmitter<{ id: string, bookingId: string}>();

  isEditing = false;
  tempRating = 0;
  tempReviewText = '';

  ngOnInit() {
    sessionStorage.getItem('user-email') === this.review.user.email ? this.isOwner = true : this.isOwner = false;
    this.resetTemp();
    console.log(this.review)
  }

  resetTemp() {
    this.tempRating = this.review.rating;
    this.tempReviewText = this.review.review;
  }

  startEdit() {
    this.isEditing = true;
    this.resetTemp();
  }

  cancelEdit() {
    this.isEditing = false;
    this.resetTemp();
  }

  saveEdit() {
    if (!this.tempReviewText.trim()) {
      alert('Review text cannot be empty!');
      return;
    }
    this.isEditing = false;
    this.reviewUpdated.emit({
      id: this.review._id,
      rating: this.tempRating,
      review: this.tempReviewText.trim(),
    });
  }

  setRating(r: number) {
    this.tempRating = r;
  }

  deleteReview() {
    this.reviewDeleted.emit({id: this.review._id, bookingId: this.review.bookingId});
  }

  getFormattedTitle(reviewText: string): string {
    console.log(this.review)
    let formattedReview = '';
    let start = 0;
    const maxLength = 50;

    while (start < reviewText.length) {
      formattedReview += reviewText.slice(start, start + maxLength) + '\n';
      start += maxLength;
    }

    return formattedReview.trim();
  }
}
