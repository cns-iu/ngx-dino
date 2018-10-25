import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { Map } from 'immutable';

import {
  BoundField,
  DataProcessor,
  Datum,
  ChangeSet,
  DataProcessorService,
  RawChangeSet
} from '@ngx-dino/core';

import { Point } from './point';

@Injectable()
export class ScatterplotDataService {
  public pointProcessor: DataProcessor<any, Point & Datum<any>>;
  private pointsChange = new BehaviorSubject<ChangeSet<Point>>(new ChangeSet<Point>());
  points: Observable<ChangeSet<Point>> = this.pointsChange.asObservable();

  private streamSubscription: Subscription;

  constructor(private processorService: DataProcessorService) { }

  fetchData(
    stream: Observable<RawChangeSet<any>>,

    pointIdField: BoundField<number | string>,

    xField: BoundField<number | string>,
    yField: BoundField<number | string>,

    colorField: BoundField<number | string>,
    shapeField: BoundField<number | string>,
    sizeField: BoundField<number | string>,
    strokeColorField: BoundField<number | string>,
    nodeTransparencyField: BoundField<number>,
    strokeTransparencyField: BoundField<number>,
    pulseField: BoundField<boolean>,

    tooltipTextField?: BoundField<number | string>
  ): this {
    if (!pointIdField) {
      return;
    }

    let extracted = {
      id: pointIdField,
      x: xField,
      y: yField,
      color: colorField,
      shape: shapeField,
      size: sizeField,
      stroke: strokeColorField,
      nodeTransparency: nodeTransparencyField,
      strokeTransparency: strokeTransparencyField,
      pulse: pulseField
    };
    if (tooltipTextField !== undefined) {
      extracted = Object.assign({ tooltip: tooltipTextField }, extracted);
    }

    this.pointProcessor = this.processorService.createProcessor<Point & Datum<any>, any>(
      stream,
      pointIdField,
      extracted
    );

    if (this.streamSubscription) {
      this.streamSubscription.unsubscribe();
    }

    this.streamSubscription = this.pointProcessor.asObservable().subscribe(
      (change) => this.pointsChange.next(change));

    return this;
  }

  updateData(changedField: BoundField<number | string>, label?: string) {
    if (label) {
      this.pointProcessor.updateFields(Map({
        [label]: changedField
      }));
    } else {
      const fieldName = changedField.id;
      this.pointProcessor.updateFields(Map({
        [fieldName]: changedField
      }));
    }
  }
}
