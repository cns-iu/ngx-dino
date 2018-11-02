import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import {
  BoundField, CachedChangeStream, DataProcessor, Datum, ChangeSet,
  DataProcessorService, RawChangeSet, simpleField, constant
} from '@ngx-dino/core';
import { Node, Link, Graph } from './network';

const UNDEFINED: BoundField<any> = simpleField<any>({label: 'Fixed', operator: constant(undefined)}).getBoundField();

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
    nodeFixedXField: BoundField<number>,
    nodeFixedYField: BoundField<number>,

    linkIdField: BoundField<number | string>,
    linkSourceField: BoundField<number | string>,
    linkTargetField: BoundField<number | string>,
    linkSizeField: BoundField<number>,

    tooltipTextField: BoundField<number | string>,
    nodeTransparencyField?: BoundField<number>,
    linkTransparencyField?: BoundField<number>,
    strokeTransparencyField?: BoundField<number>,
    linkColorField?: BoundField<string>,
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
        fx: nodeFixedXField || UNDEFINED,
        fy: nodeFixedYField || UNDEFINED,

        tooltipText: tooltipTextField,
        nodeTransparency: nodeTransparencyField,
        strokeTransparency: strokeTransparencyField
      }
    );

    this.linkProcessor = this.processorService.createProcessor<Link & Datum<any>, any>(
      linkStream,
      linkSourceField,
      {
        id: linkIdField,
        source: linkSourceField,
        target: linkTargetField,
        size: linkSizeField,
        linkTransparency: linkTransparencyField
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
