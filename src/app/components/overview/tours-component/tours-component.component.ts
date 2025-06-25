import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Review } from 'src/app/Models/Entity/Review';
import { ToursServiceService } from 'src/app/service-layer/tour/tours-service.service';

@Component({
  selector: 'app-tours-component',
  templateUrl: './tours-component.component.html',
  styleUrls: ['./tours-component.component.css']
})
export class ToursComponentComponent {

  constructor(public _route: ActivatedRoute, public _tourClient: ToursServiceService) { }

  tour?: any;
  tourName?: any= ["", ""];
  tourImageCover?: any = "loading.jpg";
  date1?:any;
  options?:any;
  formattedDate?:any;
  reviewsList?:Review[] = [];
  isUserLoggedIn: boolean = false;
  isAdmin: boolean = false;

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        const id = params['id']
        this._tourClient.fetchTourById(id).subscribe(
          data => {
            this.tour = data.data.data;
            this.tourImageCover = this.tour.imageCover;
            this.tourName = this.splitOnSecondSpace(this.tour.name)
            this.date1 = new Date(this.tour.startDates[0]);
            this.options = { year: 'numeric', month: 'long' };
            this.formattedDate = this.date1.toLocaleDateString('en-US', this.options);

            this._tourClient.fetchTourReviewsById(id).subscribe(reviews => {
              this.reviewsList = reviews.data.data;
            })
          }
        )
      }
    )

    sessionStorage.getItem("user-email") ? this.isUserLoggedIn = true : this.isUserLoggedIn = false;
    sessionStorage.getItem("user-role") === "admin" ? this.isAdmin = true : this.isAdmin = false;
  }


   splitOnSecondSpace(str: string): [string, string] {
    return str.replace(/^(\S+\s\S+)\s/, '$1|').split('|') as [string, string];
  }

}
