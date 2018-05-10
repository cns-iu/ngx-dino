import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { Changes, FieldProcessor, BoundField, CachedChangeStream, DataProcessor, Datum, ChangeSet, DataProcessorService, RawChangeSet } from '@ngx-dino/core';
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
    pointIdField: BoundField<string>,
    xField: BoundField<number | string>,
    yField: BoundField<number | string>,
    colorField: BoundField<string>,
    shapeField: BoundField<string>,
    sizeField: BoundField<number | string>,
    strokeColorField: BoundField<string>): this {
    this.pointProcessor = this.processorService.createProcessor<Point & Datum<any>, any>(
      stream, 
      pointIdField,
      {
        x: xField,
        y: yField,
        color: colorField,
        shape: shapeField,
        size: sizeField,
        stroke: strokeColorField
      }
    );

    if (this.streamSubscription) {
      this.streamSubscription.unsubscribe();
    }

    this.streamSubscription = this.pointProcessor.asObservable().subscribe(
      (change) => this.pointsChange.next(change));

    return this;
  }

  updateData() {
    this.pointProcessor.updateFields();
  }
}
