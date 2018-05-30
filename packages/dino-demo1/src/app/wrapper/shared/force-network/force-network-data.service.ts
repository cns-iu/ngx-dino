import { Injectable } from '@angular/core';
import { RawChangeSet } from '@ngx-dino/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as dummyData from './dummy-data.json';

@Injectable()
export class ForceNetworkDataService {
  private nodesChange = new BehaviorSubject<RawChangeSet<any>>(new RawChangeSet());
  public nodeStream = this.nodesChange.asObservable();
  
  private edgesChange = new BehaviorSubject<RawChangeSet<any>>(new RawChangeSet());
  public edgeStream = this.edgesChange.asObservable();

  nodeColorRange = ['#FDD3A1', '#E9583D', '#7F0000'];
  colorLegendEncoding = 'Group #';
  edgeLegendEncoding = 'Value';
  edgeSizeRange = [1, 8];
  nodeSizeRange = [5, 15];
  
  constructor() {
    dummyData.nodes.forEach((element, i) => {
      setTimeout(() => {
         this.nodesChange.next(RawChangeSet.fromArray([element]));
       }, 2000 * i);  
     });

     dummyData.links.forEach((element, i) => {
      setTimeout(() => {
         this.edgesChange.next(RawChangeSet.fromArray([element]));
       }, 2000 * i);  
     });
   }
}