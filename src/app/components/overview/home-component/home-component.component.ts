import { Component, OnInit } from '@angular/core';
import { SharedServiceService } from 'src/app/service-layer/shared-service.service';
import { ToursServiceService } from 'src/app/service-layer/tour/tours-service.service';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  constructor(public _tourClient:ToursServiceService, public _sharedService:SharedServiceService) { }

  allTours?: any
  searchValue: string = '';

  ngOnInit(): void {
    this._sharedService.search$.subscribe(value => {
      this.searchValue = value;
    });
    this.displayData()

  }


  displayData() {
    this._tourClient.fetchAllTours().subscribe(
      data=>{
        this.allTours = data.data.data;
      })
  }

 

}
