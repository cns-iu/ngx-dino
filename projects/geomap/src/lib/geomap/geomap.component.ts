import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GeoProjection } from 'd3-geo';
import { FeatureCollection } from 'geojson';
import { clamp, isString, upperFirst } from 'lodash';
import { Observable, Subject } from 'rxjs';

import {
  BoundField, DatumId, RawChangeSet,
  chain as chainOp, combine as combineOp, map as mapOp, simpleField
} from '@ngx-dino/core';
import { BuiltinSymbolTypes, CoordinateSpaceOptions, Point } from '@ngx-dino/network';
import { Bounds } from '../basemap/basemap.component';
import { FeatureSelector } from '../shared/map-data/common';
import { lookupFeatures } from '../shared/map-data/geo-features';
import { lookupProjection } from '../shared/projections';
import { ZoomLevel } from '../shared/types';

const defaultZoomLevels: ZoomLevel[] = [
  { selector: ['world', 'countries'], projection: 'eckert4', label: 'World', class: '' },
  { selector: ['world', 'united states', 'states'], projection: 'albersUsa', label: 'United States', class: '' }
];

@Component({
  selector: 'dino-geomap',
  templateUrl: './geomap.component.html',
  styleUrls: ['./geomap.component.css']
})
export class GeomapComponent implements OnInit, OnChanges {
  // Size
  @Input() autoresize = true;
  @Input() width: number | string;
  @Input() height: number | string;

  get _width() { return this.autoresize === false ? this.width : '100%'; }
  get _height() { return this.autoresize === false ? this.height : '95%'; }
  private visWidth = 0;
  private visHeight = 0;

  // Basemap
  @Input() basemapZoomLevels: ZoomLevel[];
  @Input() basemapSelectedZoomLevel: number;

  @Input() basemapColorField: BoundField<string>;
  @Input() basemapTransparencyField: BoundField<number>;
  @Input() basemapStrokeColorField: BoundField<string>;
  @Input() basemapStrokeWidthField: BoundField<number | string>;
  @Input() basemapStrokeDashArrayField: BoundField<string>;
  @Input() basemapStrokeTransparencyField: BoundField<number>;

  @Input() basemapDefaultColor: string;
  @Input() basemapDefaultTransparency: number;
  @Input() basemapDefaultStrokeColor: string;
  @Input() basemapDefaultStrokeWidth: number | string;
  @Input() basemapDefaultStrokeDashArray: string;
  @Input() basemapDefaultStrokeTransparency: number;

  basemap: FeatureCollection;
  basemapProjection: GeoProjection;
  basemapWidth = 1;
  basemapHeight = 1;
  private basemapFeatureSelector = new Subject<FeatureSelector>();

  // Nodes
  @Input() nodeStream: Observable<RawChangeSet>;
  @Input() nodeIdField: BoundField<DatumId>;
  @Input() nodePositionField: BoundField<Point>;
  @Input() nodeLatitudeField: BoundField<number>;
  @Input() nodeLongitudeField: BoundField<number>;
  @Input() nodeSizeField: BoundField<number>;
  @Input() nodeSymbolField: BoundField<BuiltinSymbolTypes>;
  @Input() nodeColorField: BoundField<string>;
  @Input() nodeStrokeColorField: BoundField<string>;
  @Input() nodeStrokeWidthField: BoundField<number>;
  @Input() nodeTooltipField: BoundField<string>;
  @Input() nodeLabelField: BoundField<string>;
  @Input() nodeLabelPositionField: BoundField<string>;
  @Input() nodeTransparencyField: BoundField<number>;
  @Input() nodeStrokeTransparencyField: BoundField<number>;
  @Input() nodePulseField: BoundField<boolean>;
  nodeProjectedPositionField: BoundField<Point>;

  // Edges
  @Input() edgeStream: Observable<RawChangeSet>;
  @Input() edgeIdField: BoundField<DatumId>;
  @Input() edgeSourceField: BoundField<Point>;
  @Input() edgeSourceLatitudeField: BoundField<number>;
  @Input() edgeSourceLongitudeField: BoundField<number>;
  @Input() edgeTargetField: BoundField<Point>;
  @Input() edgeTargetLatitudeField: BoundField<number>;
  @Input() edgeTargetLongitudeField: BoundField<number>;
  @Input() edgeStrokeColorField: BoundField<string>;
  @Input() edgeStrokeWidthField: BoundField<number>;
  @Input() edgeTransparencyField: BoundField<number>;
  edgeProjectedSourceField: BoundField<Point>;
  edgeProjectedTargetField: BoundField<Point>;

  // Tooltip element
  @ViewChild('tooltipElement', { static: true }) tooltipElement: HTMLDivElement;

  // Other network properties
  networkWidth = 0;
  networkHeight = 0;
  networkViewBox: string;
  coordinateSpace: CoordinateSpaceOptions;


  constructor() {
    this.basemapFeatureSelector.pipe(lookupFeatures()).subscribe(features => this.basemap = features);
  }

  setBasemapSelectedZoomLevel(level: number): void {
    this.basemapSelectedZoomLevel = level;
    this.ngOnChanges({ basemapSelectedZoomLevel: {} as any });
  }

  ngOnInit(): void {
    this.updateBasemap();
    this.nodeProjectedPositionField = this.checkAndGetProjectedField(
      {}, true, this.nodeProjectedPositionField,
      'nodePositionField', 'nodeLatitudeField', 'nodeLongitudeField'
    );
    this.edgeProjectedSourceField = this.checkAndGetProjectedField(
      {}, true, this.edgeProjectedSourceField,
      'edgeSourceField', 'edgeSourceLatitudeField', 'edgeSourceLongitudeField'
    );
    this.edgeProjectedTargetField = this.checkAndGetProjectedField(
      {}, true, this.edgeProjectedTargetField,
      'edgeTargetField', 'edgeTargetLatitudeField', 'edgeTargetLongitudeField'
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    let projectionUpdated = false;
    if ('basemapZoomLevels' in changes || 'basemapSelectedZoomLevel' in changes) {
      projectionUpdated = true;
      this.updateBasemap();
    }

    this.nodeProjectedPositionField = this.checkAndGetProjectedField(
      changes, projectionUpdated, this.nodeProjectedPositionField,
      'nodePositionField', 'nodeLatitudeField', 'nodeLongitudeField'
    );
    this.edgeProjectedSourceField = this.checkAndGetProjectedField(
      changes, projectionUpdated, this.edgeProjectedSourceField,
      'edgeSourceField', 'edgeSourceLatitudeField', 'edgeSourceLongitudeField'
    );
    this.edgeProjectedTargetField = this.checkAndGetProjectedField(
      changes, projectionUpdated, this.edgeProjectedTargetField,
      'edgeTargetField', 'edgeTargetLatitudeField', 'edgeTargetLongitudeField'
    );
  }

  onResize({ width: visWidth, height: visHeight }: { width: number, height: number }): void {
    const { basemapWidth, basemapHeight } = this;
    const wscale = visWidth / basemapWidth;
    const hscale = .95 * visHeight / basemapHeight;
    const networkWidth = wscale >= hscale ? basemapWidth * hscale : visWidth;
    const networkHeight = wscale >= hscale ? .95 * visHeight : basemapHeight * wscale;

    this.visWidth = visWidth;
    this.visHeight = visHeight;
    this.networkWidth = networkWidth;
    this.networkHeight = networkHeight;
    this.networkViewBox = `0,0,${networkWidth},${networkHeight}`;
  }

  onBoundsChange({ x, y, width, height }: Bounds): void {
    this.basemapWidth = width;
    this.basemapHeight = height;
    this.coordinateSpace = {
      x: {
        type: 'fixed',
        x: [x, x + width],
        xOverflow: 'ignore'
      },
      y: {
        type: 'fixed',
        y: [y, y + height],
        yOverflow: 'ignore'
      }
    };

    this.onResize({ width: this.visWidth, height: this.visHeight });
  }

  private updateBasemap(): void {
    let { basemapZoomLevels, basemapSelectedZoomLevel } = this;

    if (!basemapZoomLevels || basemapZoomLevels.length === 0) {
      basemapZoomLevels = this.basemapZoomLevels = defaultZoomLevels;
    }
    if (!basemapSelectedZoomLevel) {
      basemapSelectedZoomLevel = 0;
    }

    const length = basemapZoomLevels.length;
    const index = clamp(basemapSelectedZoomLevel, 0, length - 1);
    const { selector, projection } = basemapZoomLevels[index];

    this.basemapFeatureSelector.next(selector);
    this.basemapSelectedZoomLevel = index;
    this.basemapProjection = isString(projection) ? lookupProjection(projection) : projection;
  }

  private checkAndGetProjectedField(
    changes: SimpleChanges, force: boolean, old: BoundField<Point>,
    posName: string, xName: string, yName: string
  ): BoundField<Point> {
    const invertPoint = ([lat, long]: Point): Point => [long, lat];
    const pos = this[posName];
    const posWrappedOp = pos && pos.operator.wrapped;
    const x = this[xName];
    const y = this[yName];
    const posChanged = posName in changes;
    const xChanged = xName in changes;
    const yChanged = yName in changes;
    const hasPos = pos && (!('value' in posWrappedOp) || posWrappedOp['value'] != null);

    if (force || posChanged || (!hasPos && (xChanged || yChanged))) {
      const posOp = pos && pos.operator;
      const xOp = x && x.operator;
      const yOp = y && y.operator;
      const calcPosOp = posOp ? posOp : combineOp([xOp, yOp]);
      const op = chainOp(calcPosOp, mapOp(invertPoint), mapOp(this.basemapProjection || invertPoint));
      const field = simpleField({ label: 'Combined Projected Position', operator: op });
      return field.getBoundField();
    }

    return old;
  }
}
