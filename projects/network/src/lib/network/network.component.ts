import { Component, Input, OnInit } from '@angular/core';
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

  @Input() nodePositionField: BoundField<Point>;
  @Input() nodeSizeField: BoundField<number>;

  @Input() edgeSourceField: BoundField<Point>;
  @Input() edgeTargetField: BoundField<Point>;

  @Input() coordinateSpace: CoordinateSpaceOptions;

  nodes: Node[] = [];
  edges: Edge[] = [];

  constructor() { }

  ngOnInit() {
  }

  trackById(index: number, item: Datum): DatumId {
    return item[idSymbol];
  }
}
