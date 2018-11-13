import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { GeoProjection } from 'd3-geo';
import { FeatureCollection } from 'geojson';
import { upperFirst } from 'lodash';
import { Observable, Subject } from 'rxjs';

import {
  BoundField, DatumId, RawChangeSet,
  chain as chainOp, map as mapOp, simpleField
} from '@ngx-dino/core';
import { BuiltinSymbolTypes, CoordinateSpaceOptions, Point } from '@ngx-dino/network';
import { Bounds } from '../basemap/basemap.component';
import { FeatureSelector } from '../shared/map-data/common';
import { lookupFeatures } from '../shared/map-data/geo-features';

@Component({
  selector: 'dino-geomap-v2',
  templateUrl: './geomap-v2.component.html',
  styleUrls: ['./geomap-v2.component.css']
})
export class GeomapV2Component implements OnInit, OnChanges {
  // Size
  @Input() autoresize = true;
  @Input() width: number | string;
  @Input() height: number | string;

  get _width() { return this.autoresize === false ? this.width : '100%'; }
  get _height() { return this.autoresize === false ? this.height : '100%'; }

  // Basemap
  @Input() set basemapFeatureSelector(selector: FeatureSelector) { this._basemapFeatureSelector.next(selector); }
  @Input() basemapProjection: GeoProjection;
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
  basemapWidth = 1;
  basemapHeight = 1;
  private _basemapFeatureSelector = new Subject<FeatureSelector>();

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
    this._basemapFeatureSelector.pipe(lookupFeatures()).subscribe(
      features => this.basemap = features
    );

    // Testing only. Remove when done!
    console.log(this);
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkAndUpdateProjectedField(changes, 'node', 'position');
    this.checkAndUpdateProjectedField(changes, 'edge', 'source');
    this.checkAndUpdateProjectedField(changes, 'edge', 'target');
  }

  onResize({ width: visWidth, height: visHeight }: { width: number, height: number }): void {
    const { basemapWidth, basemapHeight } = this;
    const wscale = visWidth / basemapWidth;
    const hscale = visHeight / basemapHeight;
    let networkWidth = visWidth;
    let networkHeight = visHeight;
    let networkWidthOffset = 0;
    let networkHeightOffset = 0;

    if (wscale >= hscale) {
      networkWidth = basemapWidth * hscale;
      networkWidthOffset = (visWidth - networkWidth) / 2;
    } else {
      networkHeight = basemapHeight * wscale;
      networkHeightOffset = (visHeight - networkHeight) / 2;
    }

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
  }

  private checkAndUpdateProjectedField(changes: SimpleChanges, prefix: 'node', field: 'position'): void;
  private checkAndUpdateProjectedField(changes: SimpleChanges, prefix: 'edge', field: 'source' | 'target'): void;
  private checkAndUpdateProjectedField(
    changes: SimpleChanges, prefix: 'node' | 'edge',
    field: 'position' | 'source' | 'target'
  ): void {
    const name = prefix + upperFirst(field) + 'Field';
    const target = prefix + 'Projected' + upperFirst(field) + 'Field';
    const invertPoint = ([lat, long]: Point): Point => [long, lat];

    if (name in changes || 'basemapProjection' in changes) {
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
