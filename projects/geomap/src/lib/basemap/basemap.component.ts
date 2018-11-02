import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { GeoProjection, geoPath } from 'd3-geo';
import { FeatureCollection, Geometry } from 'geojson';

export interface Properties {
  path?: string;
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

  pathGenerator = geoPath();
  viewBox: string;

  constructor() { }

  ngOnChanges(): void {
    this.pathGenerator.projection(this.projection || null);

    if (this.basemap) {
      const [[x0, y0], [x1, y1]] = this.pathGenerator.bounds(this.basemap);
      const width = x1 - x0;
      const height = y1 - y0;
      this.viewBox = `${x0},${y0},${width},${height}`;

      this.basemap.features.forEach(feature => {
        feature.properties.path = this.pathGenerator(feature);
      });
    }
  }
}
