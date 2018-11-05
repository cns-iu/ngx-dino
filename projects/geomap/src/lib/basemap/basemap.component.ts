import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GeoProjection, geoPath } from 'd3-geo';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { defaultTo, forOwn, pick } from 'lodash';

import { BoundField } from '@ngx-dino/core';

export interface Properties {
  path?: string;
  fill?: string;
}

@Component({
  selector: '[dino-basemap]', // tslint:disable-line:component-selector
  templateUrl: './basemap.component.html',
  styleUrls: ['./basemap.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasemapComponent implements OnChanges {
  @Input() basemap: FeatureCollection<Geometry, Properties>;
  @Input() projection: GeoProjection;

  @Input() defaultFill: string;
  @Input() fillField: BoundField<string>;

  viewBox: string;

  private readonly pathGenerator = geoPath();
  private readonly propertyOperators: { [prop: string]: (feature: Feature) => any } = {
    path: (feature: Feature) => this.pathGenerator(feature),
    fill: (feature: Feature) => {
      const { defaultFill, fillField } = this;
      return fillField ? defaultTo(fillField.get(feature), defaultFill) : defaultFill;
    }
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // Set (reset) default value
    if ('defaultFill' in changes && !this.defaultFill) {
      this.defaultFill = 'black';
    }

    // Properties that needs to be recomputed.
    const ops: string[] = [];

    // Order is important here!
    // Projections must be applied before property computations.
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

      // Recompute all properties
      ops.push(...Object.keys(this.propertyOperators));
    }

    if ('fillField' in changes || 'defaultFill' in changes) {
      ops.push('fill');
    }

    // Recompute properties
    if (this.basemap) {
      const selectedPropertyOperators = pick(this.propertyOperators, ops);
      this.basemap.features.forEach(feature => forOwn(selectedPropertyOperators, (op, prop) => {
        feature.properties[prop] = op(feature);
      }));
    }
  }
}
