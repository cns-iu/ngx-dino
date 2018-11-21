import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GeoProjection } from 'd3-geo';
import { FeatureCollection } from 'geojson';
import { clamp, get, isString, upperFirst } from 'lodash';
import { Observable, Subject } from 'rxjs';

import {
  BoundField, DatumId, RawChangeSet,
  chain as chainOp, map as mapOp, simpleField
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
  @Input() edgeTargetField: BoundField<Point>;
  @Input() edgeStrokeColorField: BoundField<string>;
  @Input() edgeStrokeWidthField: BoundField<number>;
  @Input() edgeTransparencyField: BoundField<number>;
  edgeProjectedSourceField: BoundField<Point>;
  edgeProjectedTargetField: BoundField<Point>;

  // Tooltip element
  @ViewChild('tooltipElement') tooltipElement: HTMLDivElement;

  // Other network properties
  networkWidth = 0;
  networkHeight = 0;
  networkTransform: string;
  coordinateSpace: CoordinateSpaceOptions;


  constructor() {
    this.basemapFeatureSelector.pipe(lookupFeatures()).subscribe(features => this.basemap = features);
  }

  ngOnInit(): void {
    this.updateBasemap();
    this.checkAndUpdateProjectedField({}, true, 'node', 'position');
    this.checkAndUpdateProjectedField({}, true, 'edge', 'source');
    this.checkAndUpdateProjectedField({}, true, 'edge', 'target');
  }

  ngOnChanges(changes: SimpleChanges): void {
    let projectionUpdated = false;
    if ('basemapZoomLevels' in changes || 'basemapSelectedZoomLevel' in changes) {
      projectionUpdated = true;
      this.updateBasemap();
    }

    this.checkAndUpdateProjectedField(changes, projectionUpdated, 'node', 'position');
    this.checkAndUpdateProjectedField(changes, projectionUpdated, 'edge', 'source');
    this.checkAndUpdateProjectedField(changes, projectionUpdated, 'edge', 'target');
  }

  onResize({ width: visWidth, height: visHeight }: { width: number, height: number }): void {
    const { basemapWidth, basemapHeight } = this;
    const wscale = visWidth / basemapWidth;
    const hscale = .95 * visHeight / basemapHeight;
    let networkWidth = visWidth;
    let networkHeight = .95 * visHeight;
    let networkWidthOffset = 0;
    let networkHeightOffset = 0;

    if (wscale >= hscale) {
      networkWidth = basemapWidth * hscale;
      networkWidthOffset = (visWidth - networkWidth) / 2;
    } else {
      networkHeight = basemapHeight * wscale;
      networkHeightOffset = (.95 * visHeight - networkHeight) / 2;
    }

    this.visWidth = visWidth;
    this.visHeight = visHeight;
    this.networkWidth = networkWidth;
    this.networkHeight = networkHeight;
    this.networkTransform = `translate(${networkWidthOffset}px, ${networkHeightOffset}px)`;
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

  setBasemapSelectedZoomLevel(level: number): void {
    this.basemapSelectedZoomLevel = level;
    this.ngOnChanges({ basemapSelectedZoomLevel: {} as any });
  }

  private updateBasemap(): void {
    const length = get(this.basemapZoomLevels, 'length', 0);
    const index = this.basemapSelectedZoomLevel = clamp(this.basemapSelectedZoomLevel || 0, 0, length);

    this.basemapZoomLevels = length > 0 ? this.basemapZoomLevels : defaultZoomLevels;
    const zoom = this.basemapZoomLevels[index];

    this.basemapFeatureSelector.next(zoom.selector);
    this.basemapProjection = isString(zoom.projection) ? lookupProjection(zoom.projection) : zoom.projection;
  }

  private checkAndUpdateProjectedField(
    changes: SimpleChanges, projectionUpdated: boolean,
    prefix: 'node', field: 'position'
  ): void;
  private checkAndUpdateProjectedField(
    changes: SimpleChanges, projectionUpdated: boolean,
    prefix: 'edge', field: 'source' | 'target'
  ): void;
  private checkAndUpdateProjectedField(
    changes: SimpleChanges, projectionUpdated: boolean,
    prefix: 'node' | 'edge', field: 'position' | 'source' | 'target'
  ): void {
    const name = prefix + upperFirst(field) + 'Field';
    const target = prefix + 'Projected' + upperFirst(field) + 'Field';
    const invertPoint = ([lat, long]: Point): Point => [long, lat];

    if (name in changes || projectionUpdated) {
      if (this[name]) {
        const op = chainOp(
          mapOp((this[name] as BoundField<Point>).getter),
          // d3 projections expect [longitude, latitude], but our methods return [latitude, longitude]
          // -> Invert order before calling d3 projections
          mapOp(invertPoint),
          mapOp(this.basemapProjection || invertPoint)
        );
        this[target] = simpleField<Point>({
          label: 'Projected ' + name,
          operator: op
        }).getBoundField();
      } else {
        this[target] = undefined;
      }
    }
  }
}
