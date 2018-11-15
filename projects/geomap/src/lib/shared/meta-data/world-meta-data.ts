import { isNumber, once } from 'lodash';
import { OperatorFunction } from 'rxjs';
import { share } from 'rxjs/operators';

import { LookupTable, MetaSelector, MultiMetaSelector } from './common';
import { CompactCountryMetaData, rawWorldMetaData } from './world-raw-meta-data';

export interface CountryMetaData {
  readonly id: number;
  readonly name: string;
}

class CountryMetaDataImpl implements CountryMetaData {
  get id() { return this.compactData[0]; }
  get name() { return this.compactData[1]; }

  constructor(private readonly compactData: CompactCountryMetaData) { }
}

// Lazily initialized
const getCountryMetaData = once(() => rawWorldMetaData.map(data => new CountryMetaDataImpl(data)));
const getCountryIdLookupTable = LookupTable.createLazy(getCountryMetaData, 'id');
const getCountryNameLookupTable = LookupTable.createLazy(getCountryMetaData, 'name');

function getCountryLookupTableFor(
  selector: MetaSelector
): LookupTable<CountryMetaDataImpl, 'id' | 'name'> {
  const tableFun = isNumber(selector) ? getCountryIdLookupTable : getCountryNameLookupTable;
  return tableFun();
}

export function lookupCountryMetaData(): OperatorFunction<MultiMetaSelector, CountryMetaData[]> {
  return (source) => source.pipe(
    MultiMetaSelector.innerMap(selector => {
      const table = getCountryLookupTableFor(selector);
      const item = table[selector];
      if (!item) {
        throw new Error(`Invalid country selector ${selector}`);
      }
      return item;
    }),
    share()
  );
}
