import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { once } from 'lodash';
import { MultiSelector, normalizeMultiSelector, normalizeSelector } from './common';
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
    dataMap[normalizeSelector(country.id)] = country;
    dataMap[normalizeSelector(country.name)] = country;
  });
  return dataMap;
});

export function lookupCountryMetaData(): OperatorFunction<MultiSelector, CountryMetaData[]> {
  const dataMap = getCountryMetaDataMap();
  return (source: Observable<MultiSelector>): Observable<CountryMetaData[]> => {
    return source.pipe(
      map(normalizeMultiSelector),
      map(selectors => selectors.map(selector => dataMap[selector]))
    );
  };
}
