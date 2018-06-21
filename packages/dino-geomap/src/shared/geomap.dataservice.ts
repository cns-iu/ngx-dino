import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { access } from '@ngx-dino/core/src/operators/methods/extracting/access';
import {
  simpleField, BoundField,
  Datum, RawChangeSet, ChangeSet,
  DataProcessor, DataProcessorService
} from '@ngx-dino/core';
import { State } from './state';
import { Point } from './point';


// Computed fields
const computedPointLatitudeField = simpleField({
  label: 'Computed Point Latitude',
  operator: access(['lat_long', 0], Infinity)
}).getBoundField();

const computedPointLongitudeField = simpleField({
  label: 'Computed Point Longitude',
  operator: access(['lat_long', 1], Infinity)
}).getBoundField();


@Injectable()
export class GeomapDataService {
  private pointProcessor: DataProcessor<any, Point & Datum<any>>;
  private stateProcessor: DataProcessor<any, State & Datum<any>>;
  private pointStreamSubscription: Subscription;
  private stateStreamSubscription: Subscription;

  private pointsChange = new Subject<ChangeSet<Point>>();
  points: Observable<ChangeSet<Point>> = this.pointsChange.asObservable();

  private statesChange = new Subject<ChangeSet<State>>();
  states: Observable<ChangeSet<State>> = this.statesChange.asObservable();


  constructor(private service: DataProcessorService) { }


  fetchData(
    pointStream: Observable<RawChangeSet>,
    stateStream: Observable<RawChangeSet>,
    strokeColorField: BoundField<string>,
    stateField: BoundField<string>,
    stateColorField: BoundField<string>,
    stateIdField: BoundField<number>,
    pointIdField: BoundField<string>,
    pointLatLongField: BoundField<[number, number]>,
    pointSizeField: BoundField<number>,
    pointColorField: BoundField<string>,
    pointShapeField: BoundField<string>,
    pointTitleField: BoundField<string>
  ): this {
    if (this.pointStreamSubscription) {
      this.pointStreamSubscription.unsubscribe();
    }
    if (this.stateStreamSubscription) {
      this.stateStreamSubscription.unsubscribe();
    }
    if (!pointIdField || !stateIdField) {
      return;
    }

    this.pointProcessor = this.service.createProcessor<Point & Datum<any>, any>(
      pointStream,
      pointIdField,
      {
        id: pointIdField,
        lat_long: pointLatLongField,
        size: pointSizeField,
        color: pointColorField,
        shape: pointShapeField,
        stroke: strokeColorField,
        title: pointTitleField
      }, {
        latitude: computedPointLatitudeField,
        longitude: computedPointLongitudeField
      }
    );

    this.stateProcessor = this.service.createProcessor<State & Datum<any>, any>(
      stateStream,
      stateIdField,
      {
        id: stateIdField,
        label: stateField,
        color: stateColorField
      }
    );

    this.pointStreamSubscription = this.pointProcessor.asObservable().subscribe(
      (change) => this.pointsChange.next(change)
    );

    this.stateStreamSubscription = this.stateProcessor.asObservable().subscribe(
      (change) => this.statesChange.next(change)
    );

    return this;
  }

  update(
    strokeColorField: BoundField<string>,
    stateField: BoundField<string>,
    stateColorField: BoundField<string>,
    stateIdField: BoundField<number>,
    pointIdField: BoundField<string>,
    pointLatLongField: BoundField<[number, number]>,
    pointSizeField: BoundField<number>,
    pointColorField: BoundField<string>,
    pointShapeField: BoundField<string>,
    pointTitleField: BoundField<string>
  ): this {
    this.pointProcessor.updateFields(Map({
      id: pointIdField,
      lat_long: pointLatLongField,
      size: pointSizeField,
      color: pointColorField,
      shape: pointShapeField,
      stroke: strokeColorField,
      title: pointTitleField
    }));

    this.stateProcessor.updateFields(Map({
      id: stateIdField,
      label: stateField,
      color: stateColorField
    }));

    return this;
  }
}
