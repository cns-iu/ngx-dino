import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { Map } from 'immutable';

import { 
  BoundField,
  CachedChangeStream,
  DataProcessor, 
  Datum, 
  ChangeSet, 
  DataProcessorService, 
  RawChangeSet 
} from '@ngx-dino/core';

@Injectable()
export class LegendDataService {
  public nodeSizeProcessor: DataProcessor<any, any>;
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
    nodeSizeDomainField: BoundField<number | string>,
    nodeSizeRangeField: BoundField<number | string>,
    nodeShapeField: BoundField<number | string>,

    edgeStream: Observable<RawChangeSet<any>>,
    edgeIdField: BoundField<string>,
    edgeSizeField: BoundField<number>
  ): this {
    if (nodeStream && nodeIdField) {
      if (nodeSizeDomainField && nodeSizeRangeField && !nodeShapeField) {
        this.nodeSizeProcessor = this.processorService.createProcessor<Node & Datum<any>, any>(
          nodeStream, 
          nodeIdField,
          {
            id: nodeIdField,
            sizeInput: nodeSizeDomainField,
            size: nodeSizeRangeField
          }
        );
      } else if (nodeSizeDomainField && nodeSizeRangeField && nodeShapeField) {
        this.nodeSizeProcessor = this.processorService.createProcessor<Node & Datum<any>, any>(
          nodeStream, 
          nodeIdField,
          {
            id: nodeIdField,
            sizeInput: nodeSizeDomainField,
            size: nodeSizeRangeField,
            shape: nodeShapeField
          }
        );
      }

      if (this.nodeStreamSubscription) {
        this.nodeStreamSubscription.unsubscribe();
      }

      this.nodeStreamSubscription = this.nodeSizeProcessor.asObservable().subscribe(
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
        (change) => this.edgeChange.next(change));

      return this;
    }
  }

  updateData(changedField: BoundField<number | string>) {
    const fieldName = changedField.id;
    if(this.nodeSizeProcessor) {
      this.nodeSizeProcessor.updateFields(Map({
        [fieldName]: changedField
      }));
    }
    if(this.edgeSizeProcessor) {
      this.edgeSizeProcessor.updateFields(Map({
        [fieldName]: changedField
      })); 
    }
  }
}
