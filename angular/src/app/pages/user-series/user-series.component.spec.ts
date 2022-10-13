import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSeriesComponent } from './user-series.component';

describe('UserSeriesComponent', () => {
  let component: UserSeriesComponent;
  let fixture: ComponentFixture<UserSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSeriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
