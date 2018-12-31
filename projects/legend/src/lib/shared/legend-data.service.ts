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

@Injectable()
export class LegendDataService {
  public nodeLegendProcessor: DataProcessor<any, any>;
  private nodesChange = new BehaviorSubject<ChangeSet<any>>(new ChangeSet<any>());
  public nodes: Observable<ChangeSet<any>> = this.nodesChange.asObservable();

  public edgeSizeProcessor: DataProcessor<any, any>;
  private edgeChange = new BehaviorSubject<ChangeSet<any>>(new ChangeSet<any>());
  public edges: Observable<ChangeSet<any>> = this.edgeChange.asObservable();

  private nodeStreamSubscription: Subscription;
  private edgeStreamSubscription: Subscription;

  constructor(private processorService: DataProcessorService) { }

  fetchData(
    nodeStream: Observable<RawChangeSet<any>>,
    nodeIdField: BoundField<number | string>,
    nodeSizeField: BoundField<string | number>,
    nodeColorField: BoundField<string|number>,
    categoryField: BoundField<string>,

    edgeStream: Observable<RawChangeSet<any>>,
    edgeIdField: BoundField<string>,
    edgeSizeField: BoundField<number>,
  ): this {
    if (nodeStream && nodeIdField) {
      if (nodeSizeField) {
        if (categoryField) {
          this.nodeLegendProcessor = this.processorService.createProcessor<Node & Datum<any>, any>(
            nodeStream,
            nodeIdField,
            {
              id: nodeIdField,
              size: nodeSizeField,
              category: categoryField
            }
          );
        } else {
          this.nodeLegendProcessor = this.processorService.createProcessor<Node & Datum<any>, any>(
            nodeStream,
            nodeIdField,
            {
              id: nodeIdField,
              size: nodeSizeField
            }
          );
        }
      }
      if (nodeColorField) {
        if (categoryField) {
          this.nodeLegendProcessor = this.processorService.createProcessor<Node & Datum<any>, any>(
            nodeStream,
            nodeIdField,
            {
              id: nodeIdField,
              color: nodeColorField,
              category: categoryField
            }
          );
        } else {
          this.nodeLegendProcessor = this.processorService.createProcessor<Node & Datum<any>, any>(
            nodeStream,
            nodeIdField,
            {
              id: nodeIdField,
              color: nodeColorField
            }
          );
        }
      }

      if (this.nodeStreamSubscription) {
        this.nodeStreamSubscription.unsubscribe();
      }

      this.nodeStreamSubscription = this.nodeLegendProcessor.asObservable().subscribe(
        (change) => this.nodesChange.next(change));

      return this;
    }

    if (edgeStream && edgeIdField && edgeSizeField) {
      this.edgeSizeProcessor = this.processorService.createProcessor<Datum<any>, any>(
        edgeStream,
        edgeIdField,
        {
          id: edgeIdField,
          size: edgeSizeField
        }
      );

      if (this.edgeStreamSubscription) {
        this.edgeStreamSubscription.unsubscribe();
      }

      this.edgeStreamSubscription = this.edgeSizeProcessor.asObservable().subscribe(
        (change) => this.edgeChange.next(change)
      );

      return this;
    }
  }

  updateData(changedField: BoundField<number | string>) {
    const fieldName = changedField.id.slice(0, 4);
    if (this.nodeLegendProcessor) {
      this.nodeLegendProcessor.updateFields(Map({
        [fieldName]: changedField
      }));
    }
    if (this.edgeSizeProcessor) {
      this.edgeSizeProcessor.updateFields(Map({
        [fieldName]: changedField
      }));
    }
  }
}
