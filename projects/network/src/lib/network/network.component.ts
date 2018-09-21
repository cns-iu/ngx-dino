import {
  Component, ElementRef, Input, OnChanges, OnInit,
  SimpleChanges, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { clamp, conforms, filter, get, inRange, isFinite, maxBy, minBy, partition } from 'lodash';
import { scaleLinear } from 'd3-scale';
import { BoundField, ChangeSet, Datum, DatumId, RawChangeSet, idSymbol } from '@ngx-dino/core';
import { BuiltinSymbolTypes, CoordinateSpace, CoordinateSpaceOptions, FixedCoordinateSpace } from '../shared/options';
import { Edge, Node } from '../shared/types';
import { Point, normalizeRange } from '../shared/utility';
import { NetworkService } from '../shared/network.service';

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
  @Input() nodeColorField: BoundField<number>;
  @Input() nodeColorScaleRange: string[];

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

  private ingoredNodes: Node[] = [];
  private ignoredEdges: Edge[] = [];

  constructor(private service: NetworkService) {
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
      this.nodes = filter(this.applyChangeSet(set, this.nodes), nodeConform) as any;
      this.calculateLayout();
      this.setColors();
    });

    this.service.edges.subscribe((set) => {
      this.edges = filter(this.applyChangeSet(set, this.edges), edgeConform) as any;
      this.calculateLayout();
    });
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.detectStreamOrFieldChanges(changes, 'node', () => {
      this.service.fetchNodes(
        this.nodeStream, this.nodeIdField,
        this.nodePositionField, this.nodeSizeField,
        this.nodeSymbolField, this.nodeColorField
      );
    }, () => {
      this.service.updateNodes(
        this.nodePositionField, this.nodeSizeField,
        this.nodeSymbolField, this.nodeColorField
      );
    });

    this.detectStreamOrFieldChanges(changes, 'edge', () => {
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
      this.calculateLayout();
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
      this.ingoredNodes = this.nodes.concat(this.ingoredNodes);
      this.ignoredEdges = this.edges.concat(this.ignoredEdges);
      this.nodes = [];
      this.edges = [];
      return;
    }

    this.calculateLayout();
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

  private calculateLayout(): void {
    this.nodes = this.nodes.concat(this.ingoredNodes);
    this.edges = this.edges.concat(this.ignoredEdges);
    this.ingoredNodes = [];
    this.ignoredEdges = [];

    const dynamic: CoordinateSpace = { type: 'dynamic' };
    const { x: xspace = dynamic, y: yspace = dynamic } = this.coordinateSpace || { };

    // Reset values
    this.nodes.forEach((node) => {
      node.cposition = [-Infinity, -Infinity];
    });

    this.edges.forEach((edge) => {
      edge.csource = [-Infinity, -Infinity];
      edge.ctarget = [-Infinity, -Infinity];
    });

    // Apply fixed space before dynamic!
    if (xspace.type === 'fixed') {
      this.calculateFixedLayout('x');
    }
    if (yspace.type === 'fixed') {
      this.calculateFixedLayout('y');
    }
    if (xspace.type === 'dynamic') {
      this.calculateDynamicLayout('x');
    }
    if (yspace.type === 'dynamic') {
      this.calculateDynamicLayout('y');
    }
  }

  private calculateDynamicLayout(axis: 'x' | 'y'): void {
    const index = axis === 'x' ? 0 : 1;
    const boundary = axis === 'x' ? this.svgWidth : this.svgHeight;

    const rangeOf = <T>(items: T[], prop: keyof T): [number, number] => {
      const key = `${prop}[${index}]`;
      const minItem = minBy(items, key);
      const maxItem = maxBy(items, key);
      return [get(minItem, key, Infinity), get(maxItem, key, -Infinity)];
    };

    const nodeRange = rangeOf(this.nodes, 'position');
    const edgeRange1 = rangeOf(this.edges, 'source');
    const edgeRange2 = rangeOf(this.edges, 'target');
    const ranges = [nodeRange, edgeRange1, edgeRange2];
    const min = minBy(ranges, 0)[0];
    const max = maxBy(ranges, 1)[1];
    const range = max - min;

    if (!isFinite(range)) {
      return;
    }

    const normalizer = <T>(source: keyof T, target: keyof T): ((item: T) => void) => {
      return (item) => (item[target][index] = boundary * (item[source][index] - min) / range);
    };
    const scaler = <T>(prop: keyof T): ((item: T) => void) => {
      return (item) => ((item[prop] as any) *= boundary / range);
    };

    this.nodes.forEach(normalizer('position', 'cposition'));
    this.edges.forEach(normalizer('source', 'csource'));
    this.edges.forEach(normalizer('target', 'ctarget'));
    // this.nodes.forEach(scaler('size'));
    // this.edges.forEach(scaler('strokeWidth'));
  }

  private calculateFixedLayout(axis: 'x' | 'y'): void {
    const space = this.coordinateSpace[axis] as FixedCoordinateSpace;
    const index = axis === 'x' ? 0 : 1;
    const boundary = axis === 'x' ? this.svgWidth : this.svgHeight;
    const { min, max } = normalizeRange(space[axis]) || { min: 0, max: boundary };
    const range = max - min;
    const overflow = space[axis + 'Overflow'];

    if (!isFinite(range)) {
      return;
    }

    if (overflow === 'ignore') {
      const partitioner = <T>(prop: keyof T): ((item: T) => boolean) => {
        return (item) => inRange(item[prop][index], min, max);
      };
      let ignoredNodes, ignoredEdges1, ignoredEdges2;
      [this.nodes, ignoredNodes] = partition(this.nodes, partitioner('position'));
      [this.edges, ignoredEdges1] = partition(this.edges, partitioner('source'));
      [this.edges, ignoredEdges2] = partition(this.edges, partitioner('target'));

      this.ingoredNodes = this.ingoredNodes.concat(ignoredNodes);
      this.ignoredEdges = this.ignoredEdges.concat(ignoredEdges1, ignoredEdges2);
    }

    const normalizer = <T>(source: keyof T, target: keyof T): ((item: T) => void) => {
      return (item) => {
        const value = clamp(item[source][index], min, max);
        item[target][index] = boundary * (value - min) / range;
      };
    };
    const scaler = <T>(prop: keyof T): ((item: T) => void) => {
      return (item) => ((item[prop] as any) *= boundary / range);
    };

    this.nodes.forEach(normalizer('position', 'cposition'));
    this.edges.forEach(normalizer('source', 'csource'));
    this.edges.forEach(normalizer('target', 'ctarget'));
    // this.nodes.forEach(scaler('size'));
    // this.edges.forEach(scaler('strokeWidth'));
  }

  private setColors(): void {
    const min = minBy(this.nodes, 'color');
    const max = maxBy(this.nodes, 'color');
    if (!min || !max || !this.nodeColorScaleRange || this.nodeColorScaleRange.length < 2) {
      return;
    }

    const scale = scaleLinear<string>().domain([
      min.color, max.color
    ]).range(this.nodeColorScaleRange);

    this.nodes.forEach((node) => {
      node.ccolor = scale(node.color);
    });
  }
}
