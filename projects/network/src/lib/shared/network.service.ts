import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Map } from 'immutable';
import {
  BoundField, ChangeSet, DataProcessor, DataProcessorService, DatumId, RawChangeSet,
  constant, map, simpleField
} from '@ngx-dino/core';
import { Edge, Node } from './types';
import { Point } from './utility';
import { BuiltinSymbolTypes } from './options';

const cposition = simpleField({ label: '', operator: map(() => Array(2)) }).getBoundField();
const csize = simpleField({ label: '', operator: constant(0) }).getBoundField();

const csource = simpleField({ label: '', operator: map(() => Array(2)) }).getBoundField();
const ctarget = simpleField({ label: '', operator: map(() => Array(2)) }).getBoundField();

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
    color: BoundField<number>
  ): this {
    if (this.nodeSubscription) {
      this.nodeSubscription.unsubscribe();
    }

    this.nodeProcessor = this.processorService.createProcessor<Node, any>(stream, id, {
      position, size, symbol, color,
      cposition, csize
    });
    this.nodeSubscription = this.nodeProcessor.asObservable().subscribe((c) => this.nodeChanges.next(c));

    return this;
  }

  fetchEdges(
    stream: Observable<RawChangeSet>,
    id: BoundField<DatumId>,
    source: BoundField<Point>,
    target: BoundField<Point>,
    stroke: BoundField<string>,
    strokeWidth: BoundField<number>
  ): this {
    if (this.edgeSubscription) {
      this.edgeSubscription.unsubscribe();
    }

    this.edgeProcessor = this.processorService.createProcessor<Edge, any>(stream, id, {
      source, target, stroke, strokeWidth,
      csource, ctarget
    });
    this.edgeSubscription = this.edgeProcessor.asObservable().subscribe((c) => this.edgeChanges.next(c));

    return this;
  }

  updateNodes(
    position?: BoundField<Point>,
    size?: BoundField<number>,
    symbol?: BoundField<BuiltinSymbolTypes>,
    color?: BoundField<number>
  ): this {
    const fields = Map<string, BoundField<any>>({
      position, size, symbol, color
    }).filter((f) => !!f).toKeyedSeq();
    this.nodeProcessor.updateFields(fields);
    return this;
  }

  updateEdges(
    source: BoundField<Point>,
    target: BoundField<Point>,
    stroke: BoundField<string>,
    strokeWidth: BoundField<number>
  ): this {
    const fields = Map<string, BoundField<any>>({
      source, target, stroke, strokeWidth
    }).filter((f) => !!f).toKeyedSeq();
    this.edgeProcessor.updateFields(fields);
    return this;
  }
}
