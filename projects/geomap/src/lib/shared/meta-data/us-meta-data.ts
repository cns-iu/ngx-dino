import { isNumber, once } from 'lodash';
import { OperatorFunction, of } from 'rxjs';
import { combineLatest, map, share, shareReplay } from 'rxjs/operators';

import { LookupTable, MetaSelector, MultiMetaSelector } from './common';
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
  get id() { return this.compactData[0]; }
  get name() { return this.compactData[1]; }

  constructor(private readonly compactData: CompactCountyMetaData) { }
}

class StateMetaDataImpl implements StateMetaData {
  get id() { return this.compactData[0]; }
  get code() { return this.compactData[1]; }
  get name() { return this.compactData[2]; }
  get counties() {
    return this._counties || (this._counties = this.compactData[3].map(data => new CountyMetaDataImpl(data)));
  }
  get countyIdLookupTable() {
    return this._countyIdLookupTable || (this._countyIdLookupTable = LookupTable.create(this.counties, 'id'));
  }
  get countyNameLookupTable() {
    return this._countyNameLookupTable || (this._countyNameLookupTable = LookupTable.create(this.counties, 'name'));
  }

  // Lazily initialized
  private _counties: CountyMetaDataImpl[];
  private _countyIdLookupTable: LookupTable<CountyMetaDataImpl, 'id'>;
  private _countyNameLookupTable: LookupTable<CountyMetaDataImpl, 'name'>;

  constructor(private readonly compactData: CompactStateMetaData) { }
}

// Lazily initialization
const getStatesMetaData = once(() => rawUSMetaData.map(data => new StateMetaDataImpl(data)));
const getStateIdLookupTable = LookupTable.createLazy(getStatesMetaData, 'id');
const getStateCodeLookupTable = LookupTable.createLazy(getStatesMetaData, 'code');
const getStateNameLookupTable = LookupTable.createLazy(getStatesMetaData, 'name');

function getStateLookupTableFor(
  selector: MetaSelector
): LookupTable<StateMetaDataImpl, 'id' | 'code' | 'name'> {
  const tableFun = isNumber(selector) ?
    getStateIdLookupTable : selector.length === 2 ?
      getStateCodeLookupTable : getStateNameLookupTable;
  return tableFun();
}

function getCountyLookupTableFor(
  selector: MetaSelector, stateMeta: StateMetaDataImpl
): LookupTable<CountyMetaDataImpl, 'id' | 'name'> {
  const { countyIdLookupTable: idTable, countyNameLookupTable: nameTable } = stateMeta;
  return isNumber(selector) ? idTable : nameTable;
}

export function lookupStateMetaData(): OperatorFunction<MultiMetaSelector, StateMetaData[]> {
  return source => source.pipe(
    MultiMetaSelector.innerMap(selector => {
      const table = getStateLookupTableFor(selector);
      const item = table[selector];
      if (!item) {
        throw new Error(`Invalid state selector '${selector}'`);
      }
      return item;
    }),
    share()
  );
}

export function lookupCountyMetaData(stateSelector: MetaSelector): OperatorFunction<MultiMetaSelector, CountyMetaData[]> {
  const stateMetaDataObservable = of(stateSelector).pipe(
    lookupStateMetaData(),
    map(([meta]) => meta as StateMetaDataImpl),
    shareReplay(1)
  );

  return source => source.pipe(
    MultiMetaSelector.innerMap(selector => stateMetaDataObservable.pipe(
      map(stateMeta => {
        const table = getCountyLookupTableFor(selector, stateMeta);
        const item = table[selector];
        if (!item) {
          throw new Error(`Invalid county selector '${selector}'`);
        }
        return item;
      })
    )),
    share()
  );
}
