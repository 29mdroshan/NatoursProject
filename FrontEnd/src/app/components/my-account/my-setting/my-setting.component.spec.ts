import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySettingComponent } from './my-setting.component';

describe('MySettingComponent', () => {
  let component: MySettingComponent;
  let fixture: ComponentFixture<MySettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MySettingComponent]
    });
    fixture = TestBed.createComponent(MySettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
