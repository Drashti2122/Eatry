import { TestBed } from '@angular/core/testing';

import { TableReservationService } from './table-reservation.service';

describe('TableReservationService', () => {
  let service: TableReservationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableReservationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
