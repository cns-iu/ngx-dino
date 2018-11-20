import { Component, Input, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { BoundField, DatumId, RawChangeSet } from '@ngx-dino/core';
import { BuiltinSymbolTypes, CoordinateSpaceOptions } from '../shared/options';
import { Point } from '../shared/utility';

@Component({
  selector: 'dino-network',
  templateUrl: 'network.component.html',
  styleUrls: ['network.component.css']
})
export class NetworkComponent {
  // Size
  @Input() autoresize = true;
  @Input() width: number;
  @Input() height: number;

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

  // Tooltip element
  @ViewChild('tooltipElement') tooltipElement: HTMLDivElement;

  // Resizing
  resize = new Subject<{ width: number, height: number}>();
  onResize(event: { width: number, height: number}) { this.resize.next(event); }
}
