import { TestBed, inject } from '@angular/core/testing';

import { ForceNetworkService } from './force-network.service';

describe('ForceNetworkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ForceNetworkService]
    });
  });

  it('should be created', inject([ForceNetworkService], (service: ForceNetworkService) => {
    expect(service).toBeTruthy();
  }));
});
