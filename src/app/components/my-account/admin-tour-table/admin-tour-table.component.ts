import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Tours } from 'src/app/Models/Entity/Tours';
import { SharedServiceService } from 'src/app/service-layer/shared-service.service';
import { ToursServiceService } from 'src/app/service-layer/tour/tours-service.service';

@Component({
  selector: 'app-admin-tour-table',
  templateUrl: './admin-tour-table.component.html',
  styleUrls: ['./admin-tour-table.component.css']
})
export class AdminTourTableComponent {
  
  tours: Tours[] = [];

  constructor(private _tourClient: ToursServiceService, private _sharedService: SharedServiceService, private _router: Router) { }

  ngOnInit(): void {
    this._tourClient.fetchAllTours().subscribe(
      data => {
        this.tours = data.data.data;
      },
      error => {
        console.error('Error fetching tours:', error);
      }
    );
   }

   onTourClick(tour: any): void {
    this._router.navigate(['/userProfile/myReviews', tour.id]);
   }

}
