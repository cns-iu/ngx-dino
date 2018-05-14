import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { 
  BoundField,
  CachedChangeStream,
  DataProcessor, 
  Datum, 
  ChangeSet, 
  DataProcessorService, 
  RawChangeSet } from '@ngx-dino/core';

@Injectable()
export class LegendDataService {
  public nodeSizeProcessor: DataProcessor<any, any>;
  private nodesChange = new BehaviorSubject<ChangeSet<any>>(new ChangeSet<any>());
  public nodes: Observable<ChangeSet<any>> = this.nodesChange.asObservable();

  private nodeStreamSubscription: Subscription;

  constructor(private processorService: DataProcessorService) { }

  fetchData(
    nodeStream: Observable<RawChangeSet<any>>,

    nodeIdField: BoundField<number | string>,
    nodeSizeField: BoundField<string>
  ): this {
    this.nodeSizeProcessor = this.processorService.createProcessor<Node & Datum<any>, any>(
      nodeStream, 
      nodeIdField,
      {
        id: nodeIdField,
        size: nodeSizeField
      }
    );

    if (this.nodeStreamSubscription) {
      this.nodeStreamSubscription.unsubscribe();
    }

    this.nodeStreamSubscription = this.nodeSizeProcessor.asObservable().subscribe(
      (change) => this.nodesChange.next(change));

    return this;
  }

  updateData() {
    this.nodeSizeProcessor.updateFields();
  }
}
