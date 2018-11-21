import { GeoProjection } from 'd3-geo';

import { FeatureSelector } from './map-data/common';

export interface ZoomLevel {
  selector: FeatureSelector;
  projection: string | GeoProjection;
  label: string;
  class: string;
}
