import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { once } from 'lodash';
import { MetaSelector, MultiMetaSelector } from './meta-common';
import { CompactCountryMetaData, rawWorldMetaData } from './world-raw-meta-data';

export interface CountryMetaData {
  readonly id: number;
  readonly name: string;
}

class CountryMetaDataImpl implements CountryMetaData {
  get id(): number { return this.compactData[0]; }
  get name(): string { return this.compactData[1]; }

  constructor(private readonly compactData: CompactCountryMetaData) { }
}

const getCountryMetaDataMap: () => Record<string, CountryMetaDataImpl> = once(() => {
  const dataMap: Record<string, CountryMetaDataImpl> = {};
  rawWorldMetaData.map(data => new CountryMetaDataImpl(data)).forEach(country => {
    dataMap[MetaSelector.normalize(country.id)] = country;
    dataMap[MetaSelector.normalize(country.name)] = country;
  });
  return dataMap;
});

export function lookupCountryMetaData(): OperatorFunction<MultiMetaSelector, CountryMetaData[]> {
  const dataMap = getCountryMetaDataMap();
  return (source: Observable<MultiMetaSelector>): Observable<CountryMetaData[]> => {
    return source.pipe(
      map(MultiMetaSelector.normalize),
      map(selectors => selectors.map(selector => dataMap[selector]))
    );
  };
}
