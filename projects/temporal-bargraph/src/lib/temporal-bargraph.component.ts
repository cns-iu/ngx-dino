import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SymbolType } from 'd3-shape';
import { Observable, EMPTY } from 'rxjs';

import {
  BoundField, DatumId, RawChangeSet,
  chain as chainOp, combine as combineOp, map as mapOp, simpleField
} from '@ngx-dino/core';
import { CoordinateSpaceOptions, Point } from '@ngx-dino/network';
import { NumberWithDims, barSymbolField } from './shared/bar-symbol';

@Component({
  selector: 'dino-temporal-bargraph',
  templateUrl: './temporal-bargraph.component.html',
  styleUrls: ['./temporal-bargraph.component.css']
})
export class TemporalBargraphComponent implements OnInit, OnChanges {
  @Input() autoresize = true;
  @Input() width: number;
  @Input() height: number;

  get _width() { return this.autoresize === false ? this.width : '100%'; }
  get _height() { return this.autoresize === false ? this.height : '100%'; }

  // Bars
  @Input() barStream: Observable<RawChangeSet>;
  @Input() barIdField: BoundField<DatumId>;
  @Input() barPositionField: BoundField<Point>;
  @Input() barWidthField: BoundField<number>;
  @Input() barHeightField: BoundField<number>;
  @Input() barColorField: BoundField<string>;
  @Input() barStrokeColorField: BoundField<string>;
  @Input() barStrokeWidthField: BoundField<number>;
  @Input() barTooltipField: BoundField<string>;
  @Input() barLabelField: BoundField<string>;
  @Input() barLabelPositionField: BoundField<string>;
  @Input() barTransparencyField: BoundField<number>;
  @Input() barStrokeTransparencyField: BoundField<number>;
  @Input() barPulseField: BoundField<boolean>;
  barSymbolField: BoundField<SymbolType> = barSymbolField.getBoundField();
  barSizeField: BoundField<NumberWithDims>;

  // Tooltip element
  @ViewChild('tooltipElement') tooltipElement: HTMLDivElement;

  // Other network properties
  emptyStream: Observable<RawChangeSet> = EMPTY;
  networkWidth = 0;
  networkHeight = 0;
  coordinateSpace: CoordinateSpaceOptions;

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkAndUpdateSizeField(changes);
  }

  onResize({ width: visWidth, height: visHeight }: { width: number, height: number }): void {
    this.networkWidth = visWidth;
    this.networkHeight = visHeight;
  }

  checkAndUpdateSizeField(changes: SimpleChanges): void {
    const fields = ['barWidthField', 'barHeightField', 'barLabelPositionField'];
    if (fields.some(f => f in changes)) {
      const operator = chainOp(
        combineOp({
          width: this.barWidthField.operator,
          height: this.barHeightField.operator,
          lpos: chainOp(
            this.barLabelPositionField.operator,
            mapOp(lpos => {
              if (['top', 'bottom'].indexOf(lpos) !== -1) {
                return 'height';
              } else if (['left', 'right'].indexOf(lpos) !== -1) {
                return 'width';
              } else {
                return 'zero';
              }
            })
          ),
          zero: 0
        }),
        mapOp((data: any) => NumberWithDims(data[data.lpos], data.width, data.height))
      );
      const field = simpleField({ label: 'Bar Size', operator });

      this.barSizeField = field.getBoundField();
    }
  }
}
