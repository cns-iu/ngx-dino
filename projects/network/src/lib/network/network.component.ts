import { Component, ElementRef, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { BoundField, Datum, DatumId, RawChangeSet, idSymbol } from '@ngx-dino/core';
import { CoordinateSpaceOptions } from '../shared/options';
import { Edge, Node } from '../shared/types';
import { Point } from '../shared/utility';

@Component({
  selector: 'dino-network',
  templateUrl: 'network.component.html',
  styleUrls: ['network.component.css']
})
export class NetworkComponent implements OnInit {
  @Input() autoresize = false;
  @Input() width: number;
  @Input() height: number;

  @Input() nodeStream: Observable<RawChangeSet>;
  @Input() edgeStream: Observable<RawChangeSet>;

  @Input() nodeIdField: BoundField<DatumId>;
  @Input() nodePositionField: BoundField<Point>;
  @Input() nodeSizeField: BoundField<number>;

  @Input() edgeIdField: BoundField<DatumId>;
  @Input() edgeSourceField: BoundField<Point>;
  @Input() edgeTargetField: BoundField<Point>;

  @Input() coordinateSpace: CoordinateSpaceOptions;

  @ViewChild('mountPoint') mountPoint: ElementRef;

  svgWidth: number;
  svgHeight: number;

  nodes: Node[] = [];
  edges: Edge[] = [];

  constructor() { }

  ngOnInit() {
    this.nodeStream.subscribe((data) => (this.nodes = data.insert));
    this.edgeStream.subscribe((data) => (this.edges = data.insert));
  }

  trackById(index: number, item: Datum): DatumId {
    return item[idSymbol];
  }

  resizeSelf(): void {
    if (this.mountPoint) {
      const element = this.mountPoint.nativeElement;
      const {width, height} = element.getBoundingClientRect();
      this.doResize(width, height);
    }
  }

  onResize({width, height}: {width: SimpleChange, height: SimpleChange}): void {
    if (this.autoresize) {
      const wDiff = width.currentValue - width.previousValue;
      const hDiff = height.currentValue - height.previousValue;
      const newW = 0 < wDiff && wDiff < 10 ? width.previousValue : width.currentValue;
      const newH = 0 < hDiff && hDiff < 10 ? height.previousValue : height.currentValue;
      this.doResize(newW, newH);
    }
  }

  private doResize(width: number, height: number): void {
    this.svgWidth = width;
    this.svgHeight = height;
    // TODO adjust coordinates
  }
}
