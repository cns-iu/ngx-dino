import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { SymbolType } from 'd3-shape';
import { Observable, ReplaySubject } from 'rxjs';

import {
  BoundField, DatumId, RawChangeSet,
  access as accessOp, chain as chainOp, combine as combineOp, map as mapOp, simpleField
} from '@ngx-dino/core';
import { CoordinateSpaceOptions, Point } from '@ngx-dino/network';
import { NumberWithDims, barSymbolField } from './shared/bar-symbol';
import * as gridFields from './shared/grid-fields';
import { TemporalBargraphService } from './shared/temporal-bargraph.service';

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

  // Grid
  @Input() gridSpacing: number;
  gridStream = new ReplaySubject<RawChangeSet>(1);
  gridIdField: BoundField<DatumId> = gridFields.gridIdField.getBoundField();
  gridSourceField: BoundField<Point>;
  gridTargetField: BoundField<Point>;
  gridStrokeColorField: BoundField<string> = gridFields.gridStrokeColorField.getBoundField();
  gridStrokeWidthField: BoundField<number> = gridFields.gridStrokeWidthField.getBoundField();
  gridTransparencyField: BoundField<number> = gridFields.gridTransparencyField.getBoundField();
  private currentGridLineCount = 0;

  // Tooltip element
  @ViewChild('tooltipElement') tooltipElement: HTMLDivElement;

  // Other network properties
  @Input() coordinateSpace: CoordinateSpaceOptions;
  networkWidth = 0;
  networkHeight = 0;
  private spaceXMin = 0;
  private spaceXMax = 0;
  private spaceYMin = 0;
  private spaceYMax = 0;

  constructor(private service: TemporalBargraphService) {
    const gridSourceOp = combineOp<any, Point>([
      accessOp('x'),
      mapOp(() => this.spaceYMin)
    ]);
    const gridTargetOp = combineOp<any, Point>([
      accessOp('x'),
      mapOp(() => this.spaceYMax)
    ]);

    this.gridSourceField = simpleField({
      label: 'Grid Source Position', operator: gridSourceOp
    }).getBoundField();
    this.gridTargetField = simpleField({
      label: 'Grid Target Position', operator: gridTargetOp
    }).getBoundField();

    service.rangeChange.subscribe(ranges => {
      [[this.spaceXMin, this.spaceXMax], [this.spaceYMin, this.spaceYMax]] = ranges;
      this.checkAndUpdateGrid();
    });
    console.log(this);
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkAndUpdateSizeField(changes);

    this.detectStreamOrFieldChanges(changes, 'bar', () => {
      this.service.fetchBars(this.barStream, this.barIdField, this.barPositionField, this.barWidthField, this.barHeightField);
    }, () => {
      this.service.updateBars(this.barPositionField, this.barWidthField, this.barHeightField);
    });

    if ('gridSpacing' in changes) {
      this.checkAndUpdateGrid();
    }
  }

  onResize({ width: visWidth, height: visHeight }: { width: number, height: number }): void {
    this.networkWidth = visWidth;
    this.networkHeight = visHeight;
  }

  private detectStreamOrFieldChanges(
    changes: SimpleChanges, prefix: 'bar',
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

  private checkAndUpdateSizeField(changes: SimpleChanges): void {
    const fields = ['barWidthField', 'barHeightField'];
    if (fields.some(f => f in changes)) {
      const operator = chainOp(
        combineOp({
          width: this.barWidthField.operator,
          height: this.barHeightField.operator
        }),
        mapOp(({ width, height }) => {
          const max = Math.max(width, height);
          const size = max * max;
          return NumberWithDims(size, width, height);
        })
      );
      const field = simpleField({ label: 'Bar Size', operator });

      this.barSizeField = field.getBoundField();
    }
  }

  private checkAndUpdateGrid(): void {
    const spacing = this.gridSpacing > 0 ? this.gridSpacing : 0;
    const previousCount = this.currentGridLineCount;
    const { spaceXMin, spaceXMax } = this;
    let changes: RawChangeSet;

    if (!spacing || !isFinite(spaceXMin) || !isFinite(spaceXMax)) {
      if (previousCount > 0) {
        changes = new RawChangeSet(undefined, this.removeGridLines(0, previousCount));
        this.gridStream.next(changes);
        this.currentGridLineCount = 0;
      }

      return;
    }

    const xMin = spaceXMin % spacing === 0 ? spaceXMin - spacing : spaceXMin - spaceXMin % spacing;
    const xMax = spaceXMax % spacing === 0 ? spaceXMax + spacing : spaceXMax + spacing - spaceXMax % spacing;
    const count = Math.round((xMax - xMin) / spacing) + 1;
    let add: any[] = [];
    let remove: any[] = [];
    let replace: any[] = [];

    if (previousCount < count) {
      add = this.addGridLines(previousCount, count - previousCount, spacing, xMin);
      replace = this.replaceGridLines(previousCount, spacing, xMin);
    } else if (previousCount === count) {
      replace = this.replaceGridLines(count, spacing, xMin);
    } else {
      remove = this.removeGridLines(count, previousCount - count);
      replace = this.replaceGridLines(count, spacing, xMin);
    }

    changes = new RawChangeSet(add, remove, undefined, replace);
    this.gridStream.next(changes);
    this.currentGridLineCount = count;
  }

  private addGridLines(from: number, count: number, spacing: number, offset: number): any[] {
    return Array(count).fill(0).map((_unused, index) => ({
      id: from + index, x: offset + (from + index) * spacing
    }));
  }

  private removeGridLines(from: number, count: number): number[] {
    return Array(count).fill(0).map((_unused, index) => from + index);
  }

  private replaceGridLines(count: number, spacing: number, offset: number): any[] {
    return Array(count).fill(0).map((_unused, index) => [index, {
      id: index, x: offset + index * spacing
    }]);
  }
}
