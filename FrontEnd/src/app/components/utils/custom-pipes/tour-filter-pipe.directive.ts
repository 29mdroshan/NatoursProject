import { Directive, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appTourFilterPipe'
})


export class TourFilterPipeDirective implements PipeTransform {

  constructor() { }
  transform(value: any, args: string): any {

    if (!args || !value) {
      return value;
    }
          
    return value.filter((tour: any) => 
      tour.name.toLowerCase().includes(args.toLowerCase())
    );
  }

}
