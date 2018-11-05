import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GeoProjection } from 'd3-geo';
import { geoEckert4 } from 'd3-geo-projection';
import { FeatureCollection } from 'geojson';
import { Observable, Subject, of } from 'rxjs';
import { concatMap, map, share, switchAll } from 'rxjs/operators';

import { FeatureSelector } from '../shared/map-data/common';
import { lookupFeatures } from '../shared/map-data/geo-features';
import { lookupCountryMetaData } from '../shared/meta-data/world-meta-data';

@Component({
  selector: 'dino-geomap-v2',
  templateUrl: './geomap-v2.component.html',
  styleUrls: ['./geomap-v2.component.css']
})
export class GeomapV2Component implements OnInit, OnChanges {
  @Input() basemapFeatureSelector: Observable<FeatureSelector>;

  basemap: FeatureCollection;
  projection: GeoProjection;

  private _basemapFeatureSelector = new Subject<Observable<FeatureSelector>>();

  constructor() {
    const sharedBasemapFeatureSelector = this._basemapFeatureSelector.pipe(switchAll(), share());
    const projectionSelector = sharedBasemapFeatureSelector.pipe(
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
    const basemapSelector = sharedBasemapFeatureSelector.pipe(lookupFeatures());

    projectionSelector.subscribe(projection => this.projection = projection);
    basemapSelector.subscribe(features => this.basemap = features);

    console.log(this, Subject);
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('basemapFeatureSelector' in changes) {
      this._basemapFeatureSelector.next(this.basemapFeatureSelector);
    }
  }
}
