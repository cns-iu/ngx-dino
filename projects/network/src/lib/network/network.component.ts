import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { BoundField, DatumId, RawChangeSet, NgxDinoEvent } from '@ngx-dino/core';
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
  @Input() nodeXField: BoundField<number>;
  @Input() nodeYField: BoundField<number>;
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
  @Input() edgeSourceXField: BoundField<number>;
  @Input() edgeSourceYField: BoundField<number>;
  @Input() edgeTargetField: BoundField<Point>;
  @Input() edgeTargetXField: BoundField<number>;
  @Input() edgeTargetYField: BoundField<number>;
  @Input() edgeStrokeField: BoundField<string>;
  @Input() edgeStrokeWidthField: BoundField<number>;
  @Input() edgeTransparencyField: BoundField<number>;

  // Other inputs
  @Input() coordinateSpace: CoordinateSpaceOptions;

  // Outputs
  @Output() nodeClick = new EventEmitter<NgxDinoEvent>();
  @Output() edgeClick = new EventEmitter<NgxDinoEvent>();

  // Tooltip element
  @ViewChild('tooltipElement', { static: true }) tooltipElement: HTMLDivElement;

  // Resizing
  resize = new Subject<{ width: number, height: number}>();
  onResize(event: { width: number, height: number}) { this.resize.next(event); }
}
