import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTourTableComponent } from './admin-tour-table.component';

describe('AdminTourTableComponent', () => {
  let component: AdminTourTableComponent;
  let fixture: ComponentFixture<AdminTourTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTourTableComponent]
    });
    fixture = TestBed.createComponent(AdminTourTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
