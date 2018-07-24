import { TestBed, inject } from '@angular/core/testing';

import { VegaService } from './vega.service';

describe('VegaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VegaService]
    });
  });

  it('should be created', inject([VegaService], (service: VegaService) => {
    expect(service).toBeTruthy();
  }));
});
