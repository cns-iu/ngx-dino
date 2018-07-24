import { TestBed, inject } from '@angular/core/testing';

import { ScienceMapService } from './science-map.service';

describe('ScienceMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScienceMapService]
    });
  });

  it('should be created', inject([ScienceMapService], (service: ScienceMapService) => {
    expect(service).toBeTruthy();
  }));
});
