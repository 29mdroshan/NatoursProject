import { Component, Input, OnInit } from '@angular/core';
import { SharedServiceService } from 'src/app/service-layer/shared-service.service';

@Component({
  selector: 'app-tour-card',
  templateUrl: './tour-card.component.html',
  styleUrls: ['./tour-card.component.css']
})
export class TourCardComponent implements OnInit{
  @Input('tour')
  tour?:any

  date1?:any;
  options?:any;
  formattedDate?:any;

  ngOnInit(): void {
    this.date1 = new Date(this.tour.startDates[0]);
    this.options = { year: 'numeric', month: 'long' };
    this.formattedDate = this.date1.toLocaleDateString('en-US', this.options);
  }


}
