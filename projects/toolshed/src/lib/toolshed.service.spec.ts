import { TestBed } from '@angular/core/testing';

import { ToolshedService } from './toolshed.service';

describe('ToolshedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolshedService = TestBed.get(ToolshedService);
    expect(service).toBeTruthy();
  });
});
