import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import {
  BoundField, CachedChangeStream, DataProcessor, Datum, ChangeSet,
  DataProcessorService, RawChangeSet
} from '@ngx-dino/core';
import { Node, Link, Graph } from './network';

@Injectable()
export class ForceNetworkDataService {
  public nodeProcessor: DataProcessor<any, Node & Datum<any>>;
  public linkProcessor: DataProcessor<any, Link & Datum<any>>;

  private nodesChange = new BehaviorSubject<ChangeSet<Node>>(new ChangeSet<Node>());
  public nodes: Observable<ChangeSet<Node>> = this.nodesChange.asObservable();

  private linksChange = new BehaviorSubject<ChangeSet<Link>>(new ChangeSet<Link>());
  public links: Observable<ChangeSet<Link>> = this.linksChange.asObservable();

  private nodeStreamSubscription: Subscription;
  private linkStreamSubscription: Subscription;

  constructor(private processorService: DataProcessorService) { }

  fetchData(
    nodeStream: Observable<RawChangeSet<any>>,
    linkStream: Observable<RawChangeSet<any>>,

    nodeIdField: BoundField<number | string>,
    nodeSizeField: BoundField<string>,
    nodeColorField: BoundField<number>,
    nodeLabelField: BoundField<string>,

    linkSourceField: BoundField<number | string>,
    linkTargetField: BoundField<number | string>,
    linkSizeField: BoundField<number>,

    tooltipTextField: BoundField<number | string>,

    linkColorField?: BoundField<string>,
    linkOpacityField?: BoundField<string>,
    labelSizeField?: BoundField<string>
  ): this {
    this.nodeProcessor = this.processorService.createProcessor<Node & Datum<any>, any>(
      nodeStream,
      nodeIdField,
      {
        id: nodeIdField,
        size: nodeSizeField,
        color: nodeColorField,
        label: nodeLabelField,

        tooltipText: tooltipTextField
      }
    );

    this.linkProcessor = this.processorService.createProcessor<Link & Datum<any>, any>(
      linkStream,
      linkSourceField,
      {
        source: linkSourceField,
        target: linkTargetField,
        size: linkSizeField
      }
    );

    if (this.nodeStreamSubscription) {
      this.nodeStreamSubscription.unsubscribe();
    }

    if (this.linkStreamSubscription) {
      this.linkStreamSubscription.unsubscribe();
    }

    this.nodeStreamSubscription = this.nodeProcessor.asObservable().subscribe(
      (change) => this.nodesChange.next(change));

    this.linkStreamSubscription = this.linkProcessor.asObservable().subscribe(
        (change) => this.linksChange.next(change));

    return this;
  }

  updateData() {
    this.nodeProcessor.updateFields();
    this.linkProcessor.updateFields();
  }
}
