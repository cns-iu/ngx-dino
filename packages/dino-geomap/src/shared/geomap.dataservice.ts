import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { Changes, IField, Field, FieldProcessor } from '@ngx-dino/core';
import { State } from './state';
import { Point } from './point';


// Computed fields
const computedPointLatitudeField = new Field<number>({
  name: 'lat_long[0]', label: 'Computed Point Latitude', datatype: 'number'
});

const computedPointLongitudeField = new Field<number>({
  name: 'lat_long[1]', label: 'Computed Point Longitude', datatype: 'number'
});


@Injectable()
export class GeomapDataService {
  private pointProcessor: FieldProcessor<Point>;
  private stateProcessor: FieldProcessor<State>;
  private pointStreamSubscription: Subscription;
  private stateStreamSubscription: Subscription;

  private pointsChange = new BehaviorSubject<Changes<Point>>(
    new Changes<Point>()
  );
  points: Observable<Changes<Point>> = this.pointsChange.asObservable();

  private statesChange = new BehaviorSubject<Changes<State>>(
    new Changes<State>()
  );
  states: Observable<Changes<State>> = this.statesChange.asObservable();

  fetchData(
    pointStream: Observable<Changes<any>>,
    stateStream: Observable<Changes<any>>,
    strokeColorField: IField<string>,
    stateField: IField<string>,
    stateColorField: IField<string>,
    stateIdField: IField<number>,
    pointIdField: IField<string>,
    pointLatLongField: IField<[number, number]>,
    pointSizeField: IField<number>,
    pointColorField: IField<string>,
    pointShapeField: IField<string>
  ): this {
    this.pointProcessor = new FieldProcessor<Point>(pointStream, {
      id: pointIdField,
      lat_long: pointLatLongField,
      size: pointSizeField,
      color: pointColorField,
      shape: pointShapeField,
      stroke: strokeColorField
    }, {
        latitude: computedPointLatitudeField,
        longitude: computedPointLongitudeField
      });

    this.stateProcessor = new FieldProcessor<State>(stateStream, {
      id: stateIdField,
      label: stateField,
      color: stateColorField
    });

    this.pointStreamSubscription = this.pointProcessor.asObservable().subscribe(
      (change) => this.pointsChange.next(change)
    );

    this.stateStreamSubscription = this.stateProcessor.asObservable().subscribe(
      (change) => this.statesChange.next(change)
    );

    return this;
  }
}
