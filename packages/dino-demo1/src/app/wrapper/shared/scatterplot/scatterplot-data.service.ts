import { Injectable } from '@angular/core';

import { RawChangeSet } from '@ngx-dino/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as dummyData from './dummy-data.json';

@Injectable()
export class ScatterplotDataService {
  private pointsChange = new BehaviorSubject<RawChangeSet<any>>(new RawChangeSet());
  data = this.pointsChange.asObservable();
  
  constructor() {
    dummyData.forEach((element, i) => {
     setTimeout(() => {
        this.pointsChange.next(RawChangeSet.fromArray([element]));
      }, 2000 * i);  
    });
   }
}
