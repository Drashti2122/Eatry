import { TestBed } from '@angular/core/testing';

import { DashPanelService } from './dash-panel.service';

describe('DashPanelService', () => {
  let service: DashPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
