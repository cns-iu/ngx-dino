import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Set } from 'immutable';
import { conforms, debounce, filter, isFinite } from 'lodash';
import { Observable, Subscription } from 'rxjs';

import { BoundField, ChangeSet, Datum, DatumId, RawChangeSet, idSymbol } from '@ngx-dino/core';
import { LayoutService } from '../shared/layout.service';
import { NetworkService } from '../shared/network.service';
import { BuiltinSymbolTypes, CoordinateSpaceOptions } from '../shared/options';
import { Edge, Node } from '../shared/types';
import { Point } from '../shared/utility';

@Component({
  selector: 'dino-pure-network, [dino-pure-network]',
  templateUrl: './pure-network.component.html',
  styleUrls: ['./pure-network.component.css'],
  providers: [NetworkService]
})
export class PureNetworkComponent implements OnInit, OnChanges {
  // Size
  @Input() autoresize = true;
  @Input() width: number;
  @Input() height: number;

  get _width() { return !this.autoresize ? this.width : '100%'; }
  get _height() { return !this.autoresize ? this.height : '100%'; }

  // Nodes
  @Input() nodeStream: Observable<RawChangeSet>;
  @Input() nodeIdField: BoundField<DatumId>;
  @Input() nodePositionField: BoundField<Point>;
  @Input() nodeSizeField: BoundField<number>;
  @Input() nodeSymbolField: BoundField<BuiltinSymbolTypes>;
  @Input() nodeColorField: BoundField<string>;
  @Input() nodeStrokeField: BoundField<string>;
  @Input() nodeStrokeWidthField: BoundField<number>;
  @Input() nodeTooltipField: BoundField<string>;
  @Input() nodeLabelField: BoundField<string>;
  @Input() nodeLabelPositionField: BoundField<string>;
  @Input() nodeTransparencyField: BoundField<number>;
  @Input() strokeTransparencyField: BoundField<number>;
  @Input() nodePulseField: BoundField<boolean>;

  // Edges
  @Input() edgeStream: Observable<RawChangeSet>;
  @Input() edgeIdField: BoundField<DatumId>;
  @Input() edgeSourceField: BoundField<Point>;
  @Input() edgeTargetField: BoundField<Point>;
  @Input() edgeStrokeField: BoundField<string>;
  @Input() edgeStrokeWidthField: BoundField<number>;
  @Input() edgeTransparencyField: BoundField<number>;

  // Other inputs
  @Input() coordinateSpace: CoordinateSpaceOptions;
  @Input() adjustMargins = true;
  @Input() tooltipElement: HTMLDivElement;
  @Input() resize: Observable<{ width: number, height: number }>;

  svgWidth: number;
  svgHeight: number;
  private resizeSubscription: Subscription;

  nodes: Node[] = [];
  edges: Edge[] = [];
  private excludedNodes: Node[] = [];
  private excludedEdges: Edge[] = [];
  private get allNodes(): Node[] { return this.nodes.concat(this.excludedNodes); }
  private get allEdges(): Edge[] { return this.edges.concat(this.excludedEdges); }

  private debouncedLayout: () => void;
  private debouncedLayoutArgs: [Node[], Edge[]] = [undefined, undefined];

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
      const filtered = filter(this.applyChangeSet(set, this.allEdges), edgeConform) as any;
      this.layout(undefined, filtered);
    });

    this.debouncedLayout = debounce(() => {
      const [nodes = this.allNodes, edges = this.allEdges] = this.debouncedLayoutArgs;
      this.debouncedLayoutArgs = [undefined, undefined];
      ({
        nodes: this.nodes, edges: this.edges,
        excludedNodes: this.excludedNodes, excludedEdges: this.excludedEdges
      } = this.layoutService.layout(nodes, edges, {
        width: this.svgWidth, height: this.svgHeight,
        coordinateSpace: this.coordinateSpace, adjustMargins: this.adjustMargins
      }));
    }, 16);
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.detectStreamOrFieldChanges(changes, 'node', () => {
      this.nodes = [];
      this.excludedNodes = [];
      this.debouncedLayoutArgs[0] = undefined;
      this.service.fetchNodes(
        this.nodeStream, this.nodeIdField,
        this.nodePositionField, this.nodeSizeField,
        this.nodeSymbolField, this.nodeColorField,
        this.nodeStrokeField, this.nodeStrokeWidthField,
        this.nodeTooltipField, this.nodeLabelField,
        this.nodeLabelPositionField, this.nodeTransparencyField,
        this.strokeTransparencyField, this.nodePulseField
      );
    }, () => {
      this.nodes = [];
      this.excludedNodes = [];
      this.debouncedLayoutArgs[0] = undefined;
      this.service.updateNodes(
        this.nodePositionField, this.nodeSizeField,
        this.nodeSymbolField, this.nodeColorField,
        this.nodeStrokeField, this.nodeStrokeWidthField,
        this.nodeTooltipField, this.nodeLabelField,
        this.nodeLabelPositionField, this.nodeTransparencyField,
        this.strokeTransparencyField, this.nodePulseField
      );
    });

    this.detectStreamOrFieldChanges(changes, 'edge', () => {
      this.edges = [];
      this.excludedEdges = [];
      this.debouncedLayoutArgs[1] = undefined;
      this.service.fetchEdges(
        this.edgeStream, this.edgeIdField,
        this.edgeSourceField, this.edgeTargetField,
        this.edgeStrokeField, this.edgeStrokeWidthField,
        this.edgeTransparencyField
      );
    }, () => {
      this.edges = [];
      this.excludedEdges = [];
      this.debouncedLayoutArgs[1] = undefined;
      this.service.updateEdges(
        this.edgeSourceField, this.edgeTargetField,
        this.edgeStrokeField, this.edgeStrokeWidthField,
        this.edgeTransparencyField
      );
    });

    if ('resize' in changes) {
      if (this.resizeSubscription) {
        this.resizeSubscription.unsubscribe();
      }

      this.resizeSubscription = this.resize.subscribe(this.onResize.bind(this));
    }

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
      // const wDiff = width - this.svgWidth;
      // const hDiff = height - this.svgHeight;
      // const newW = 0 < wDiff && wDiff < 25 ? this.svgWidth : width;
      // const newH = 0 < hDiff && hDiff < 25 ? this.svgHeight : height;
      this.doResize(width, height);
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
    const removeIds = set.remove.map(rem => rem[idSymbol]);
    const replaceIds = set.replace.map(rep => rep[idSymbol]);
    const filteredIds = Set<DatumId>().merge(removeIds, replaceIds);
    const filtered = data.filter(item => !filteredIds.has(item[idSymbol]));

    return filtered.concat(set.insert.toArray() as T[], set.replace.toArray() as T[]);
  }

  private layout(nodes?: Node[], edges?: Edge[]): void {
    this.debouncedLayoutArgs[0] = nodes || this.debouncedLayoutArgs[0];
    this.debouncedLayoutArgs[1] = edges || this.debouncedLayoutArgs[1];
    this.debouncedLayout();
  }
}
