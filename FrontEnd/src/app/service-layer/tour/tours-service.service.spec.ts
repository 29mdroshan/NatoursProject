import { TestBed } from '@angular/core/testing';
import { ToursServiceService } from './tours-service.service';

describe('ToursServiceService', () => {
  let service: ToursServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToursServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
