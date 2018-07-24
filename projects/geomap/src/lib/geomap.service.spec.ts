import { TestBed, inject } from '@angular/core/testing';

import { GeomapService } from './geomap.service';

describe('GeomapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeomapService]
    });
  });

  it('should be created', inject([GeomapService], (service: GeomapService) => {
    expect(service).toBeTruthy();
  }));
});
