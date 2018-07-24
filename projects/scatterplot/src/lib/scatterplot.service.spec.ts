import { TestBed, inject } from '@angular/core/testing';

import { ScatterplotService } from './scatterplot.service';

describe('ScatterplotService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScatterplotService]
    });
  });

  it('should be created', inject([ScatterplotService], (service: ScatterplotService) => {
    expect(service).toBeTruthy();
  }));
});
