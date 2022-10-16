import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserseriesHandlerComponent } from './userseries-handler.component';

describe('UserseriesHandlerComponent', () => {
  let component: UserseriesHandlerComponent;
  let fixture: ComponentFixture<UserseriesHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserseriesHandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserseriesHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
