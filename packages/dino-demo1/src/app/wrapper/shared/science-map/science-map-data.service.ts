import { Injectable } from '@angular/core';
import * as dummyData from './dummy-data.json';

@Injectable()
export class ScienceMapDataService {
  filteredSubdisciplines = dummyData;

  constructor() { }
}