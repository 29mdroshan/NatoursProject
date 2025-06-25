import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tours } from '../Models/Entity/Tours';

@Injectable({
  providedIn: 'root'
})
export class SharedServiceService {

  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  constructor() {}

  updateSearchValue(value: string): void {
    this.searchSubject.next(value);
  }

}
