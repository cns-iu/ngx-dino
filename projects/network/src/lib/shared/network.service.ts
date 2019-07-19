import { Injectable } from '@angular/core';
import {
  BoundField,
  ChangeSet,
  constant,
  DataProcessor,
  DataProcessorService,
  DatumId,
  map,
  RawChangeSet,
  simpleField,
} from '@ngx-dino/core';
import { Map } from 'immutable';
import { stubArray } from 'lodash';
import { Observable, Subject, Subscription } from 'rxjs';

import { BuiltinSymbolTypes } from './options';
import { Edge, Node } from './types';
import { Point } from './utility';

const cposition = simpleField({ label: '', operator: map(stubArray) }).getBoundField();
const csize = simpleField({ label: '', operator: constant(0) }).getBoundField();

const csource = simpleField({ label: '', operator: map(stubArray) }).getBoundField();
const ctarget = simpleField({ label: '', operator: map(stubArray) }).getBoundField();

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  public nodeProcessor: DataProcessor<any, Node>;
  public edgeProcessor: DataProcessor<any, Edge>;

  private nodeChanges = new Subject<ChangeSet<Node>>();
  private edgeChanges = new Subject<ChangeSet<Edge>>();

  readonly nodes: Observable<ChangeSet<Node>> = this.nodeChanges.asObservable();
  readonly edges: Observable<ChangeSet<Edge>> = this.edgeChanges.asObservable();

  private nodeSubscription: Subscription;
  private edgeSubscription: Subscription;

  constructor(private processorService: DataProcessorService) { }

  fetchNodes(
    stream: Observable<RawChangeSet>,
    id: BoundField<DatumId>,
    position: BoundField<Point>,
    size: BoundField<number>,
    symbol: BoundField<BuiltinSymbolTypes>,
    color: BoundField<string>,
    stroke: BoundField<string>,
    strokeWidth: BoundField<number>,
    tooltip: BoundField<string>,
    label: BoundField<string>,
    labelPosition: BoundField<string>,
    transparency: BoundField<number>,
    strokeTransparency: BoundField<number>,
    pulse: BoundField<boolean>
  ): this {
    if (this.nodeSubscription) {
      this.nodeSubscription.unsubscribe();
    }

    this.nodeProcessor = this.processorService.createProcessor<Node, any>(stream, id, {
      position, size, symbol, color, stroke, strokeWidth, tooltip,
      label, labelPosition, transparency, strokeTransparency, pulse,
      cposition, csize
    }, {}, { keepAlive: true });
    this.nodeSubscription = this.nodeProcessor.asObservable().subscribe((c) => this.nodeChanges.next(c));

    return this;
  }

  fetchEdges(
    stream: Observable<RawChangeSet>,
    id: BoundField<DatumId>,
    source: BoundField<Point>,
    target: BoundField<Point>,
    stroke: BoundField<string>,
    strokeWidth: BoundField<number>,
    transparency: BoundField<number>
  ): this {
    if (this.edgeSubscription) {
      this.edgeSubscription.unsubscribe();
    }

    this.edgeProcessor = this.processorService.createProcessor<Edge, any>(stream, id, {
      source, target, stroke, strokeWidth, transparency,
      csource, ctarget
    }, {}, { keepAlive: true });
    this.edgeSubscription = this.edgeProcessor.asObservable().subscribe((c) => this.edgeChanges.next(c));

    return this;
  }

  updateNodes(
    position?: BoundField<Point>,
    size?: BoundField<number>,
    symbol?: BoundField<BuiltinSymbolTypes>,
    color?: BoundField<string>,
    stroke?: BoundField<string>,
    strokeWidth?: BoundField<number>,
    tooltip?: BoundField<string>,
    label?: BoundField<string>,
    labelPosition?: BoundField<string>,
    transparency?: BoundField<number>,
    strokeTransparency?: BoundField<number>,
    pulse?: BoundField<boolean>
  ): this {
    const fields = Map<string, BoundField<any>>({
      position, size, symbol, color, stroke, strokeWidth, tooltip,
      label, labelPosition, transparency, strokeTransparency, pulse
    }).filter((f) => !!f).toKeyedSeq();
    this.nodeProcessor.updateFields(fields);
    return this;
  }

  updateEdges(
    source: BoundField<Point>,
    target: BoundField<Point>,
    stroke: BoundField<string>,
    strokeWidth: BoundField<number>,
    transparency: BoundField<number>
  ): this {
    const fields = Map<string, BoundField<any>>({
      source, target, stroke, strokeWidth, transparency
    }).filter((f) => !!f).toKeyedSeq();
    this.edgeProcessor.updateFields(fields);
    return this;
  }
}
