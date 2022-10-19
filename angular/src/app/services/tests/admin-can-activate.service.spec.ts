import { TestBed } from '@angular/core/testing';

import { AdminCanActivateService } from '../admin-can-activate.service';

describe('AdminCanActivateService', () => {
  let service: AdminCanActivateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCanActivateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
