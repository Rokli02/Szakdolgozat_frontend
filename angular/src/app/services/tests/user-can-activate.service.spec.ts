import { TestBed } from '@angular/core/testing';

import { UserCanActivateService } from '../user-can-activate.service';

describe('UserCanActivateService', () => {
  let service: UserCanActivateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCanActivateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
