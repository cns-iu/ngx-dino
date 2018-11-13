import { ChangeDetectionStrategy, Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { GeoProjection, geoPath } from 'd3-geo';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { defaultTo, forOwn, pick } from 'lodash';
import { Observable, ReplaySubject } from 'rxjs';

import { BoundField } from '@ngx-dino/core';

export interface Properties {
  path?: string;
  color?: string;
  transparency?: number;
  strokeColor?: string;
  strokeWidth?: number | string;
  strokeDashArray?: string;
  strokeTransparency?: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

function createFromFieldWithDefault<T>(
  prop: keyof Properties
): (this: BasemapComponent, feature: Feature) => T {
  const fieldProp = prop + 'Field';
  const defaultProp = 'default' + prop.charAt(0).toUpperCase() + prop.slice(1);
  return function (feature) {
    const field: BoundField<T> = this[fieldProp];
    const defaultValue: T = this[defaultProp];
    return field ? defaultTo(field.get(feature), defaultValue) : defaultValue;
  };
}

function checkFieldWithDefaultChange(
  changes: SimpleChanges, prop: keyof Properties, changeArray: (keyof Properties)[]
): void {
  const fieldProp = prop + 'Field';
  const defaultProp = 'default' + prop.charAt(0).toUpperCase() + prop.slice(1);
  if (fieldProp in changes || defaultProp in changes) {
    changeArray.push(prop);
  }
}

const propertyOperators: Record<keyof Properties, (this: BasemapComponent, feature: Feature) => any> = {
  path(feature: Feature) { return this.pathGenerator(feature); },
  color: createFromFieldWithDefault('color'),
  transparency: createFromFieldWithDefault('transparency'),
  strokeColor: createFromFieldWithDefault('strokeColor'),
  strokeWidth: createFromFieldWithDefault('strokeWidth'),
  strokeDashArray: createFromFieldWithDefault('strokeDashArray'),
  strokeTransparency: createFromFieldWithDefault('strokeTransparency')
};

@Component({
  selector: '[dino-basemap]', // tslint:disable-line:component-selector
  templateUrl: './basemap.component.html',
  styleUrls: ['./basemap.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasemapComponent implements OnChanges {
  // Geometry and projection
  @Input() basemap: FeatureCollection<Geometry, Properties>;
  @Input() projection: GeoProjection;

  // Fill
  @Input() colorField: BoundField<string>;
  @Input() defaultColor: string;

  @Input() transparencyField: BoundField<number>;
  @Input() defaultTransparency: number;

  // Stroke
  @Input() strokeColorField: BoundField<string>;
  @Input() defaultStrokeColor: string;

  @Input() strokeWidthField: BoundField<number | string>;
  @Input() defaultStrokeWidth: number | string;

  @Input() strokeDashArrayField: BoundField<string>;
  @Input() defaultStrokeDashArray: string;

  @Input() strokeTransparencyField: BoundField<number>;
  @Input() defaultStrokeTransparency: number;

  // Bounds change detection
  @Output() readonly boundsChanged: Observable<Bounds>;
  private readonly _boundsChanged = new ReplaySubject<Bounds>(1);

  viewBox: string;
  readonly pathGenerator = geoPath();

  constructor() {
    this.boundsChanged = this._boundsChanged.asObservable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Properties that needs to be recomputed.
    const ops: (keyof Properties)[] = [];

    // Order is important here!
    // Projections must be applied before bounds computations.
    if ('projection' in changes) {
      this.pathGenerator.projection(this.projection || null); // Null -> identity projection
      ops.push('path');
    }

    if ('basemap' in changes && this.basemap) {
      // Calculate and set bounds
      const [[x0, y0], [x1, y1]] = this.pathGenerator.bounds(this.basemap);
      const width = x1 - x0;
      const height = y1 - y0;
      this.viewBox = `${x0},${y0},${width},${height}`;
      this._boundsChanged.next({ x: x0, y: y0, width, height });

      // Recompute all properties
      ops.push(...(Object.keys(propertyOperators) as (keyof Properties)[]));
    } else {
      // Check for changed properties
      checkFieldWithDefaultChange(changes, 'color', ops);
      checkFieldWithDefaultChange(changes, 'transparency', ops);
      checkFieldWithDefaultChange(changes, 'strokeColor', ops);
      checkFieldWithDefaultChange(changes, 'strokeWidth', ops);
      checkFieldWithDefaultChange(changes, 'strokeDashArray', ops);
      checkFieldWithDefaultChange(changes, 'strokeTransparency', ops);
    }

    // Recompute properties
    if (this.basemap) {
      const selectedPropertyOperators = pick(propertyOperators, ops);
      this.basemap.features.forEach(feature => (feature.properties = feature.properties || {}));
      this.basemap.features.forEach(feature => forOwn(selectedPropertyOperators, (op, prop) => {
        feature.properties[prop] = (op as Function).call(this, feature);
      }));
    }
  }
}
