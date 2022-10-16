import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesHandlerComponent } from './series-handler.component';

describe('SeriesHandlerComponent', () => {
  let component: SeriesHandlerComponent;
  let fixture: ComponentFixture<SeriesHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeriesHandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
