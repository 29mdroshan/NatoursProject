import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToursComponentComponent } from './tours-component.component';

describe('ToursComponentComponent', () => {
  let component: ToursComponentComponent;
  let fixture: ComponentFixture<ToursComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToursComponentComponent]
    });
    fixture = TestBed.createComponent(ToursComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
