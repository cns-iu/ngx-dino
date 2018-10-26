import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { once } from 'lodash';
import { MultiSelector, Selector, normalizeMultiSelector, normalizeSelector } from './meta-common';
import { CompactCountyMetaData, CompactStateMetaData, rawUSMetaData } from './us-raw-meta-data';

export interface CountyMetaData {
  id: number;
  name: string;
}

export interface StateMetaData {
  readonly id: number;
  readonly code: string;
  readonly name: string;
}

class CountyMetaDataImpl implements CountyMetaData {
  get id(): number { return this.compactData[0]; }
  get name(): string { return this.compactData[1]; }

  constructor(private readonly compactData: CompactCountyMetaData) { }
}

class StateMetaDataImpl implements StateMetaData {
  get id(): number { return this.compactData[0]; }
  get code(): string { return this.compactData[1]; }
  get name(): string { return this.compactData[2]; }
  readonly countyMap: Record<string, CountyMetaDataImpl> = {};

  constructor(private readonly compactData: CompactStateMetaData) {
    compactData[3].map(data => new CountyMetaDataImpl(data)).forEach(county => {
      this.countyMap[normalizeSelector(county.id)] = county;
      this.countyMap[normalizeSelector(county.name)] = county;
    });
  }
}

const getStateMetaDataMap: () => Record<string, StateMetaDataImpl> = once(() => {
  const dataMap: Record<string, StateMetaDataImpl> = {};
  rawUSMetaData.map(data => new StateMetaDataImpl(data)).forEach(state => {
    dataMap[normalizeSelector(state.id)] = state;
    dataMap[normalizeSelector(state.code)] = state;
    dataMap[normalizeSelector(state.name)] = state;
  });
  return dataMap;
});

export function lookupStateMetaData(): OperatorFunction<MultiSelector, StateMetaData[]> {
  const dataMap = getStateMetaDataMap();
  return (source: Observable<MultiSelector>): Observable<StateMetaData[]> => {
    return source.pipe(
      map(normalizeMultiSelector),
      map(selectors => selectors.map(selector => dataMap[selector]))
    );
  };
}

export function lookupCountyMetaData(stateSelector: Selector): OperatorFunction<MultiSelector, CountyMetaData[]> {
  const state = getStateMetaDataMap()[normalizeSelector(stateSelector)];
  return (source: Observable<MultiSelector>): Observable<CountyMetaData[]> => {
    return source.pipe(
      map(normalizeMultiSelector),
      map(selectors => selectors.map(selector => state.countyMap[selector]))
    );
  };
}
