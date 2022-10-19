import { TestBed } from '@angular/core/testing';

import { SiteManagerCanActivateService } from '../site-manager-can-activate.service';

describe('SiteManagerCanActivateService', () => {
  let service: SiteManagerCanActivateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteManagerCanActivateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
