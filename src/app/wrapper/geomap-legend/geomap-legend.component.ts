import { Component, OnInit } from '@angular/core';

import { RawChangeSet, Datum, idSymbol } from '@ngx-dino/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  pointIdField, pointSizeField
} from '../shared/geomap/geomap-fields';

import pointData from '../shared/geomap/point-dummy-data';

@Component({
  selector: 'app-geomap-legend',
  templateUrl: './geomap-legend.component.html',
  styleUrls: ['./geomap-legend.component.sass']
})
export class GeomapLegendComponent implements OnInit {
  nodeSizeRange = [5, 10];
  nodeIdField = pointIdField.getBoundField();
  nodeSizeField = pointSizeField.getBoundField();
  nodeStream: Observable<RawChangeSet>;

  constructor() {
    this.nodeStream = new Observable((subscriber) => {
      (pointData as any[]).forEach((data, i) => {
        setTimeout(() => subscriber.next([data]), 1000 * i);
      });
      setTimeout(() => subscriber.complete(), 1000 * pointData.length);
    }).pipe(map(RawChangeSet.fromArray));
  }

  ngOnInit() {
  }

}
