import { TestBed } from '@angular/core/testing';

import { UserSeriesService } from '../user-series.service';

describe('UserSeriesService', () => {
  let service: UserSeriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSeriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
