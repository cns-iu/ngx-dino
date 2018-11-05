import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeoProjection } from 'd3-geo';
import { geoEckert4 } from 'd3-geo-projection';
import { FeatureCollection } from 'geojson';
import { Subject, of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

import { BoundField } from '@ngx-dino/core';
import { FeatureSelector } from '../shared/map-data/common';
import { lookupFeatures } from '../shared/map-data/geo-features';
import { lookupCountryMetaData } from '../shared/meta-data/world-meta-data';

@Component({
  selector: 'dino-geomap-v2',
  templateUrl: './geomap-v2.component.html',
  styleUrls: ['./geomap-v2.component.css']
})
export class GeomapV2Component implements OnInit, OnChanges {
  @Input() set basemapFeatureSelector(selector: FeatureSelector) { this._basemapFeatureSelector.next(selector); }
  @Input() basemapProjection: GeoProjection;
  @Input() basemapFillField: BoundField<string>;

  basemap: FeatureCollection;
  projection: GeoProjection;

  private _basemapFeatureSelector = new Subject<FeatureSelector>();

  constructor() {
    const projectionSelector = this._basemapFeatureSelector.pipe(
      map(selector => selector[1]),
      map(country => country === 'countries' ? undefined : country),
      concatMap(country => country ? of(country).pipe(lookupCountryMetaData()) : of<undefined>(undefined)),
      map(meta => meta && meta[0]),
      map(meta => {
        if (meta && meta.id === 840) { // USA
          return null; // Identity projection
        }
        return geoEckert4();
      })
    );
    const basemapSelector = this._basemapFeatureSelector.pipe(lookupFeatures());

    projectionSelector.subscribe(projection => this.projection = projection);
    basemapSelector.subscribe(features => this.basemap = features);

    console.log(this);
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void { }
}
