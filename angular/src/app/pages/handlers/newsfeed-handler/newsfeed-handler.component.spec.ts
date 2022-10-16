import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsfeedHandlerComponent } from './newsfeed-handler.component';

describe('NewsfeedHandlerComponent', () => {
  let component: NewsfeedHandlerComponent;
  let fixture: ComponentFixture<NewsfeedHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsfeedHandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsfeedHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
