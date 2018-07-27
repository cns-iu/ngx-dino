import { Injectable } from '@angular/core';

import { RawChangeSet } from '@ngx-dino/core';

import { BehaviorSubject } from 'rxjs';

import dummyData from './dummy-data';

@Injectable()
export class ScienceMapDataService {
  private subdisciplineChange = new BehaviorSubject<RawChangeSet<any>>(new RawChangeSet());
  filteredSubdisciplines = this.subdisciplineChange.asObservable();

  constructor() {
    dummyData.data.forEach((element, i) => {
      setTimeout(() => {
         this.subdisciplineChange.next(RawChangeSet.fromArray([element]));
       }, 2000 * i);
     });
    }
}
