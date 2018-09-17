import { TestBed, inject } from '@angular/core/testing';

import { ResizeSensorService } from './resize-sensor.service';

describe('ResizeSensorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResizeSensorService]
    });
  });

  it('should be created', inject([ResizeSensorService], (service: ResizeSensorService) => {
    expect(service).toBeTruthy();
  }));
});
