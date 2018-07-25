import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BoundField, RawChangeSet } from '@ngx-dino/core';
import {
  stateField, stateColorField,
  pointIdField, pointLatLongField, pointSizeField, pointColorField,
  pointShapeField, pointStrokeColorField, pointTitleField
} from '../shared/geomap/geomap-fields';
import * as stateData from '../shared/geomap/state-dummy-data.json';
import * as pointData from '../shared/geomap/point-dummy-data.json';


@Component({
  selector: 'app-geomap',
  templateUrl: './geomap.component.html',
  styleUrls: ['./geomap.component.sass']
})
export class GeomapComponent implements OnInit {
  @Input() height: number;
  @Input() width: number;

  stateDataStream: Observable<RawChangeSet>;
  stateField: BoundField<string> = stateField.getBoundField();
  stateColorField: BoundField<string> = stateColorField.getBoundField();

  pointDataStream: Observable<RawChangeSet>;
  pointIdField: BoundField<string> = pointIdField.getBoundField();
  pointLatLongField: BoundField<[number, number]> = pointLatLongField.getBoundField();
  pointSizeField: BoundField<number> = pointSizeField.getBoundField();
  pointColorField: BoundField<string> = pointColorField.getBoundField();
  pointShapeField: BoundField<string> = pointShapeField.getBoundField();
  strokeColorField: BoundField<string> = pointStrokeColorField.getBoundField();
  pointTitleField: BoundField<string> = pointTitleField.getBoundField();

  constructor() {
    this.stateDataStream = new Observable((subscriber) => {
      (stateData as any[]).forEach((data, i) => {
        setTimeout(() => subscriber.next([data]), 1000 * i);
      });
      setTimeout(() => subscriber.complete(), 1000 * stateData.length);
    }).map(RawChangeSet.fromArray);

    this.pointDataStream = new Observable((subscriber) => {
      (pointData as any[]).forEach((data, i) => {
        setTimeout(() => subscriber.next([data]), 1000 * i);
      });
      setTimeout(() => subscriber.complete(), 1000 * pointData.length);
    }).map(RawChangeSet.fromArray);
  }

  ngOnInit() {
  }
}
