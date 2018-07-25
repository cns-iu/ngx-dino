import { TestBed, inject } from '@angular/core/testing';

import { VegaUtilService } from './vega-util.service';

describe('VegaUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VegaUtilService]
    });
  });

  it('should be created', inject([VegaUtilService], (service: VegaUtilService) => {
    expect(service).toBeTruthy();
  }));
});
