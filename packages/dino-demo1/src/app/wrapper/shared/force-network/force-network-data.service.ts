import { Injectable } from '@angular/core';
import * as dummyData from './dummy-data.json';

@Injectable()
export class ForceNetworkDataService {
  nodeColorRange = ['#FDD3A1', '#E9583D', '#7F0000'];
  colorLegendEncoding = '# Co-Authors';
  edgeLegendEncoding = '# Co-Authored Publications';
  edgeSizeRange = [1, 8];
  
  filteredNetworkGraph = dummyData;

  constructor() { }
}