import { Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { once } from 'lodash';
import { MetaSelector, MultiMetaSelector } from './meta-common';
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
      this.countyMap[MetaSelector.normalize(county.id)] = county;
      this.countyMap[MetaSelector.normalize(county.name)] = county;
    });
  }
}

const getStateMetaDataMap: () => Record<string, StateMetaDataImpl> = once(() => {
  const dataMap: Record<string, StateMetaDataImpl> = {};
  rawUSMetaData.map(data => new StateMetaDataImpl(data)).forEach(state => {
    dataMap[MetaSelector.normalize(state.id)] = state;
    dataMap[MetaSelector.normalize(state.code)] = state;
    dataMap[MetaSelector.normalize(state.name)] = state;
  });
  return dataMap;
});

export function lookupStateMetaData(): OperatorFunction<MultiMetaSelector, StateMetaData[]> {
  const dataMap = getStateMetaDataMap();
  return (source: Observable<MultiMetaSelector>): Observable<StateMetaData[]> => {
    return source.pipe(
      map(MultiMetaSelector.normalize),
      map(selectors => selectors.map(selector => dataMap[selector]))
    );
  };
}

export function lookupCountyMetaData(stateSelector: MetaSelector): OperatorFunction<MultiMetaSelector, CountyMetaData[]> {
  const state = getStateMetaDataMap()[MetaSelector.normalize(stateSelector)];
  return (source: Observable<MultiMetaSelector>): Observable<CountyMetaData[]> => {
    return source.pipe(
      map(MultiMetaSelector.normalize),
      map(selectors => selectors.map(selector => state.countyMap[selector]))
    );
  };
}
