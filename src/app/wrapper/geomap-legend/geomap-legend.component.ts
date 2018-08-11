import { Component, OnInit } from '@angular/core';

import { RawChangeSet, Datum, idSymbol } from '@ngx-dino/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  pointIdField, stateField,
  pointSizeField,
  pointColorField, stateColorField,
  pointColorCategoryField, stateColorCategoryField
} from '../shared/geomap/geomap-fields';

import pointData from '../shared/geomap/point-dummy-data';
import stateData from '../shared/geomap/state-dummy-data';

@Component({
  selector: 'app-geomap-legend',
  templateUrl: './geomap-legend.component.html',
  styleUrls: ['./geomap-legend.component.sass']
})
export class GeomapLegendComponent implements OnInit {
  nodeSizeRange = [5, 10];

  nodeIdField = pointIdField.getBoundField();
  stateIdField = stateField.getBoundField();

  nodeSizeField = pointSizeField.getBoundField();

  nodeColorField = pointColorField.getBoundField();
  stateColorField = stateColorField.getBoundField();

  nodeColorCategoryField = pointColorCategoryField.getBoundField();
  stateColorCategoryField = stateColorCategoryField.getBoundField();

  gradient = ['#bdbdbd', '#000000'].toString();

  nodeStream: Observable<RawChangeSet>;
  stateStream: Observable<RawChangeSet>;

  constructor() {
    this.nodeStream = new Observable((subscriber) => {
      (pointData as any[]).forEach((data, i) => {
        setTimeout(() => subscriber.next([data]), 1000 * i);
      });
      setTimeout(() => subscriber.complete(), 1000 * pointData.length);
    }).pipe(map(RawChangeSet.fromArray));

    this.stateStream = new Observable((subscriber) => {
      (stateData as any[]).forEach((data, i) => {
        setTimeout(() => subscriber.next([data]), 1000 * i);
      });
      setTimeout(() => subscriber.complete(), 1000 * stateData.length);
    }).pipe(map(RawChangeSet.fromArray));
  }

  ngOnInit() {
  }

}
