import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GeoProjection, geoPath } from 'd3-geo';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { defaultTo } from 'lodash';

import { BoundField } from '@ngx-dino/core';

export interface Properties {
  path?: string;
  fill?: string;
}

function createFieldApplier<T>(
  field: BoundField<T>, defaultValue?: T
): (feature: Feature) => T {
  if (field) {
    return feature => defaultTo(field.get(feature), defaultValue);
  }
  return () => defaultValue;
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

  pathGenerator = geoPath();
  viewBox: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('defaultFill' in changes && !this.defaultFill) {
      this.defaultFill = 'black'; // Set default value
    }

    if ('basemap' in changes || 'projection' in changes) {
      this.pathGenerator.projection(this.projection || null);

      if (this.basemap) {
        // Calculate and set bounds
        const [[x0, y0], [x1, y1]] = this.pathGenerator.bounds(this.basemap);
        const width = x1 - x0;
        const height = y1 - y0;
        this.viewBox = `${x0},${y0},${width},${height}`;

        // Create operations
        const fillOp = createFieldApplier(this.fillField, this.defaultFill);

        // Compute properties
        this.basemap.features.forEach(feature => {
          const { properties } = feature;

          properties.path = this.pathGenerator(feature);
          properties.fill = fillOp(feature);
        });
      }
    }
  }
}
