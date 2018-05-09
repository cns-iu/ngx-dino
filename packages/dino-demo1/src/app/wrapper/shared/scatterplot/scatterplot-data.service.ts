import { Injectable } from '@angular/core';
import * as dummyData from './dummy-data.json';

@Injectable()
export class ScatterplotDataService {
  data = dummyData;

  constructor() { }

}
