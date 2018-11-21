import { GeoProjection, geoAlbersUsa } from 'd3-geo';
import { geoEckert4 } from 'd3-geo-projection';

const projectionLookupTable: { [name: string]: () => GeoProjection } = {
  albersusa: geoAlbersUsa,
  eckert4: geoEckert4
};

export function lookupProjection(name: string): GeoProjection {
  const constructor = projectionLookupTable[name.toLowerCase()];
  return constructor && constructor();
}
