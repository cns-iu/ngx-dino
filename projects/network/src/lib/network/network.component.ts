import {
  Component, ElementRef, Input, OnChanges, OnInit,
  SimpleChange, SimpleChanges, ViewChild
} from '@angular/core';
import { Observable } from 'rxjs';
import { BoundField, ChangeSet, Datum, DatumId, RawChangeSet, idSymbol } from '@ngx-dino/core';
import { BuiltinSymbolTypes, CoordinateSpaceOptions } from '../shared/options';
import { Edge, Node } from '../shared/types';
import { Point } from '../shared/utility';
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
  @Input() nodeColorField: BoundField<string>;

  @Input() edgeIdField: BoundField<DatumId>;
  @Input() edgeSourceField: BoundField<Point>;
  @Input() edgeTargetField: BoundField<Point>;
  @Input() edgeStrokeField: BoundField<string>;
  @Input() edgeStrokeWidthField: BoundField<string>;

  @Input() coordinateSpace: CoordinateSpaceOptions;

  @ViewChild('mountPoint') mountPoint: ElementRef;

  svgWidth: number;
  svgHeight: number;

  nodes: Node[] = [];
  edges: Edge[] = [];

  constructor(private service: NetworkService) {
    this.service.nodes.subscribe((set) => (this.nodes = this.applyChangeSet(set, this.nodes)));
    this.service.edges.subscribe((set) => (this.edges = this.applyChangeSet(set, this.edges)));
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
    // TODO adjust coordinates
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
}
