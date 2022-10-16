import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscHandlerComponent } from './misc-handler.component';

describe('MiscHandlerComponent', () => {
  let component: MiscHandlerComponent;
  let fixture: ComponentFixture<MiscHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscHandlerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
