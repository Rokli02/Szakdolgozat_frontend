import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendChooserComponent } from './backend-chooser.component';

describe('BackendChooserComponent', () => {
  let component: BackendChooserComponent;
  let fixture: ComponentFixture<BackendChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackendChooserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
