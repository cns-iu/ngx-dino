import { TestBed } from '@angular/core/testing';

import { TemporalBargraphService } from './temporal-bargraph.service';

describe('TemporalBargraphService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TemporalBargraphService = TestBed.get(TemporalBargraphService);
    expect(service).toBeTruthy();
  });
});
