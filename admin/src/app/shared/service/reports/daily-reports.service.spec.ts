import { TestBed } from '@angular/core/testing';

import { DailyReportsService } from './daily-reports.service';

describe('DailyReportsService', () => {
  let service: DailyReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
