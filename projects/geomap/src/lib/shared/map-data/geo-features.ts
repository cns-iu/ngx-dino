import { FeatureCollection } from 'geojson';
import { Many, ary, conformsTo, get, isArray, isNumber, isString, matches } from 'lodash';
import { Observable, OperatorFunction, from, of, EMPTY } from 'rxjs';
import { concatAll, concatMap, filter, map, reduce, share } from 'rxjs/operators';
import { feature } from 'topojson-client';
import { GeometryCollection, Topology } from 'topojson-specification';

import { FeatureSelector, MultiFeatureSelector } from './common';
import { lookupCountyMetaData, lookupStateMetaData } from '../meta-data/us-meta-data';
import { usTopoJson } from './us-topojson';
import { worldTopoJson } from './world-topojson';
import { lookupCountryMetaData } from '../meta-data/world-meta-data';


// Short/abbreviated country names.
// FIXME: Move to meta data files.
const countryShortNames: { [name: string]: number } = {
  'us': 840, 'usa': 840
};

// Lookup the numerical id for an identifier using the provided meta data lookup operator.
function getMetaIdObservable(
  source: number | string | Observable<number | string>,
  op: () => OperatorFunction<string, { id: number }[]>
): Observable<number> {
  return (isString(source) || isNumber(source) ? of(source) : source).pipe(
    op(),
    map(([meta]) => meta),
    filter(meta => !!meta),
    map(meta => meta.id)
  );
}

function createFeatureObservable(
  topology: Topology,
  object: GeometryCollection | Many<string>,
  idSource?: Observable<number>,
  idEqual: (id1: number, id2: number) => boolean = (id1, id2) => id1 === id2
): Observable<FeatureCollection> {
  let obj: GeometryCollection;
  if (conformsTo(object, { type: matches('GeometryCollection'), geometries: isArray })) {
    obj = object as GeometryCollection;
  } else {
    obj = get(topology.objects, object as Many<string>) as GeometryCollection;
  }

  let source = of(obj);
  if (idSource) {
    source = idSource.pipe(
      map(id => obj.geometries.filter(({ id: gid}) => idEqual(id, Number(gid)))),
      map(gdata => ({ type: 'GeometryCollection', geometries: gdata } as GeometryCollection))
    );
  }

  return source.pipe(map(gcollection => feature(topology, gcollection) as FeatureCollection));
}

function selectFeatures(selector: string[]): Observable<FeatureCollection> {
  const [world, country = 'land'] = selector;
  const countrySelector = countryShortNames[country] || country;
  const countryIdObservable = getMetaIdObservable(countrySelector, lookupCountryMetaData);

  switch (selector.length) {
    case 0: /* falls through */
    case 1:
      if (world !== 'world') {
        return EMPTY;
      }
      /* falls through */
    case 2:
      if (country === 'land' || country === 'countries') {
        return createFeatureObservable(worldTopoJson, country);
      } else {
        return createFeatureObservable(worldTopoJson, 'countries', countryIdObservable);
      }

    default:
      return countryIdObservable.pipe(
        filter(id => id === 840), //  Currently only handles USA
        concatMap(() => selectUsFeatures(selector.slice(2)))
      );
  }
}

function selectUsFeatures(selector: string[]): Observable<FeatureCollection> {
  const [state, county] = selector;
  const stateIdObservable = getMetaIdObservable(state, lookupStateMetaData);
  const countyIdObservable = getMetaIdObservable(stateIdObservable, () => {
    return concatMap(stateId => of(county).pipe(lookupCountyMetaData(stateId)));
  });

  switch (selector.length) {
    case 0:
      throw new Error('Invalid call to selectUsFeatures');

    case 1:
      if (state === 'states') {
        return createFeatureObservable(usTopoJson, 'states');
      } else {
        return createFeatureObservable(usTopoJson, 'states', stateIdObservable);
      }

    case 2:
      if (county === 'counties') {
        if (state === 'states') {
          return createFeatureObservable(usTopoJson, 'counties');
        } else {
          return createFeatureObservable(usTopoJson, 'counties', stateIdObservable, (stateId, countyId) => {
            return Math.trunc(countyId / 1000) === stateId;
          });
        }
      } else {
        if (state === 'states') {
          throw new Error('Invalid selector');
        }

        return createFeatureObservable(usTopoJson, 'counties', countyIdObservable);
      }
  }
}

function mergeFeatures(...collections: FeatureCollection[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: [].concat(...collections.map(col => col.features))
  };
}

export function lookupFeatures(): OperatorFunction<MultiFeatureSelector, FeatureCollection> {
  return (source) => source.pipe(
    map(MultiFeatureSelector.normalize),
    concatMap(selectors => from(selectors.map(selectFeatures)).pipe(
      concatAll(),
      reduce<FeatureCollection>(ary(mergeFeatures, 2), { type: 'FeatureCollection', features: [] })
    )),
    share()
  );
}
