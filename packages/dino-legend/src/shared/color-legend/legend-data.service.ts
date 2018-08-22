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

  private nodeStreamSubscription: Subscription;

  constructor(private processorService: DataProcessorService) { }

  fetchData(
    nodeStream: Observable<RawChangeSet<any>>,
    nodeIdField: BoundField<number | string>,
  
    nodeColorField: BoundField<string|number>,
    categoryField: BoundField<string>
  ): this {
    if (nodeStream && nodeIdField) {
      if (nodeColorField) {
        if (categoryField) {
          this.nodeLegendProcessor = this.processorService.createProcessor<Node & Datum<any>, any>(
            nodeStream,
            nodeIdField,
            {
              id: nodeIdField,
              [nodeColorField.id]: nodeColorField,
              [categoryField.id]: categoryField
            }
          );
        } else {
          this.nodeLegendProcessor = this.processorService.createProcessor<Node & Datum<any>, any>(
            nodeStream,
            nodeIdField,
            {
              id: nodeIdField,
              [nodeColorField.id]: nodeColorField
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
  }

  updateData(changedField: BoundField<number | string>) {
    const fieldName = changedField.id;
    if (this.nodeLegendProcessor) {
      this.nodeLegendProcessor.updateFields(Map({
        [fieldName]: changedField
      }));
    }
  }
}