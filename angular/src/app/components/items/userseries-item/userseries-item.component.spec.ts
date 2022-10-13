import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserseriesItemComponent } from './userseries-item.component';

describe('UserseriesItemComponent', () => {
  let component: UserseriesItemComponent;
  let fixture: ComponentFixture<UserseriesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserseriesItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserseriesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
