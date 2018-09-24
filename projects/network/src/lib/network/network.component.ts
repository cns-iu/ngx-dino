import {
  Component, ElementRef, Input, OnChanges, OnInit,
  SimpleChanges, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { clamp, conforms, filter, get, inRange, isFinite, maxBy, minBy, partition } from 'lodash';
import { BoundField, ChangeSet, Datum, DatumId, RawChangeSet, idSymbol } from '@ngx-dino/core';
import { BuiltinSymbolTypes, CoordinateSpace, CoordinateSpaceOptions, FixedCoordinateSpace } from '../shared/options';
import { Edge, Node } from '../shared/types';
import { Point, normalizeRange } from '../shared/utility';
import { NetworkService } from '../shared/network.service';
import { LayoutService } from '../shared/layout.service';

@Component({
  selector: 'dino-network',
  templateUrl: 'network.component.html',
  styleUrls: ['network.component.css']
})
export class NetworkComponent implements OnInit, OnChanges {
  @Input() autoresize = false;
  @Input() width: number;
  @Input() height: number;

  @Input() nodeStream: Observable<RawChangeSet>;
  @Input() edgeStream: Observable<RawChangeSet>;

  @Input() nodeIdField: BoundField<DatumId>;
  @Input() nodePositionField: BoundField<Point>;
  @Input() nodeSizeField: BoundField<number>;
  @Input() nodeSymbolField: BoundField<BuiltinSymbolTypes>;
  @Input() nodeColorField: BoundField<string>;
  @Input() nodeStrokeField: BoundField<string>;
  @Input() nodeStrokeWidthField: BoundField<number>;

  @Input() edgeIdField: BoundField<DatumId>;
  @Input() edgeSourceField: BoundField<Point>;
  @Input() edgeTargetField: BoundField<Point>;
  @Input() edgeStrokeField: BoundField<string>;
  @Input() edgeStrokeWidthField: BoundField<number>;

  @Input() coordinateSpace: CoordinateSpaceOptions;

  @ViewChild('mountPoint') mountPoint: ElementRef;

  svgWidth: number;
  svgHeight: number;

  nodes: Node[] = [];
  edges: Edge[] = [];
  private excludedNodes: Node[] = [];
  private excludedEdges: Edge[] = [];
  private get allNodes(): Node[] { return this.nodes.concat(this.excludedNodes); }
  private get allEdges(): Edge[] { return this.edges.concat(this.excludedEdges); }

  constructor(private service: NetworkService, private layoutService: LayoutService) {
    const pointConform = conforms({
      [0]: isFinite,
      [1]: isFinite
    });
    const nodeConform = conforms({
      position: pointConform,
      size: isFinite
    });
    const edgeConform = conforms({
      source: pointConform,
      target: pointConform
    });

    this.service.nodes.subscribe((set) => {
      const filtered = filter(this.applyChangeSet(set, this.allNodes), nodeConform) as any;
      this.layout(filtered);
    });

    this.service.edges.subscribe((set) => {
      const edges = this.edges.concat(this.excludedEdges);
      const filtered = filter(this.applyChangeSet(set, this.allEdges), edgeConform) as any;
      this.layout(undefined, filtered);
    });
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.detectStreamOrFieldChanges(changes, 'node', () => {
      this.nodes = [];
      this.excludedNodes = [];
      this.service.fetchNodes(
        this.nodeStream, this.nodeIdField,
        this.nodePositionField, this.nodeSizeField,
        this.nodeSymbolField, this.nodeColorField,
        this.nodeStrokeField, this.nodeStrokeWidthField
      );
    }, () => {
      this.service.updateNodes(
        this.nodePositionField, this.nodeSizeField,
        this.nodeSymbolField, this.nodeColorField,
        this.nodeStrokeField, this.nodeStrokeWidthField
      );
    });

    this.detectStreamOrFieldChanges(changes, 'edge', () => {
      this.edges = [];
      this.excludedEdges = [];
      this.service.fetchEdges(
        this.edgeStream, this.edgeIdField,
        this.edgeSourceField, this.edgeTargetField,
        this.edgeStrokeField, this.edgeStrokeWidthField
      );
    }, () => {
      this.service.updateEdges(
        this.edgeSourceField, this.edgeTargetField,
        this.edgeStrokeField, this.edgeStrokeWidthField
      );
    });

    if (!this.autoresize && ('width' in changes || 'height' in changes)) {
      this.doResize(this.width, this.height);
    }

    if ('coordinateSpace' in changes) {
      this.layout();
    }
  }

  trackById(index: number, item: Datum): DatumId {
    return item[idSymbol];
  }

  onResize({width, height}: {width: number, height: number}): void {
    if (this.autoresize) {
      const wDiff = width - this.svgWidth;
      const hDiff = height - this.svgHeight;
      const newW = 0 < wDiff && wDiff < 25 ? this.svgWidth : width;
      const newH = 0 < hDiff && hDiff < 25 ? this.svgHeight : height;
      this.doResize(newW, newH);
    }
  }

  private doResize(width: number, height: number): void {
    this.svgWidth = width;
    this.svgHeight = height;

    if (width === 0 || height === 0) {
      this.excludedNodes = this.allNodes;
      this.excludedEdges = this.allEdges;
      this.nodes = [];
      this.edges = [];
      return;
    }

    this.layout();
  }

  private detectStreamOrFieldChanges(
    changes: SimpleChanges, prefix: 'node' | 'edge',
    fetch: () => void, update: () => void
  ): void {
    const re = new RegExp('^' + prefix);
    let shouldUpdate = false;
    for (const prop in changes) {
      if (!re.test(prop)) {
        continue;
      }

      if (/(Stream)|(IdField)$/.test(prop)) {
        shouldUpdate = false;
        fetch();
        break;
      } else if (/Field$/.test(prop)) {
        shouldUpdate = true;
      }
    }

    if (shouldUpdate) {
      update();
    }
  }

  private applyChangeSet<T extends Datum>(set: ChangeSet<any>, data: T[]): T[] {
    const filtered = data.filter((item) => {
      const id = item[idSymbol];
      if (set.remove.find((value) => value[idSymbol] === id)) {
        return false;
      } else if (set.replace.find((value) => value[idSymbol] === id)) {
        return false;
      } else {
        return true;
      }
    });

    return filtered.concat(set.insert.toArray() as T[]);
  }

  private layout(nodes: Node[] = this.allNodes, edges: Edge[] = this.allEdges): void {
    ({
      nodes: this.nodes, edges: this.edges,
      excludedNodes: this.excludedNodes, excludedEdges: this.excludedEdges
    } = this.layoutService.layout(nodes, edges, {
      width: this.svgWidth, height: this.svgHeight,
      coordinateSpace: this.coordinateSpace
    }));
  }
}
