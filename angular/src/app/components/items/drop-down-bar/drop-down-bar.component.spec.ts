import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownBarComponent } from './drop-down-bar.component';

describe('DropDownBarComponent', () => {
  let component: DropDownBarComponent;
  let fixture: ComponentFixture<DropDownBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropDownBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropDownBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
