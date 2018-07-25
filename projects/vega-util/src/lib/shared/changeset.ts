import { Collection, Map, Set } from 'immutable';
import { forOwn } from 'lodash';

import { vega } from './vega';
import {
  ChangeSet as DinoChangeSet,
  Datum, DatumId, idSymbol, rawDataSymbol
} from '@ngx-dino/core';


// General utility
function getDatumId(datum: Datum): DatumId {
  return datum[idSymbol];
}


// Dino -> Vega set utility
function insertDatums(
  vegaSet: VegaChangeSet<Datum>,
  datums: Collection.Indexed<Datum>
): void {
  vegaSet.insert(datums.toArray());
}

function removeDatums(
  vegaSet: VegaChangeSet<Datum>,
  datums: Collection.Indexed<Datum>
): void {
  const ids = datums.map(getDatumId).toSet();
  vegaSet.remove((datum) => ids.contains(getDatumId(datum)));
}

function modifyDatums(
  vegaSet: VegaChangeSet<Datum>,
  datums: Collection.Indexed<Datum>
): void {
  const byIds = Map<DatumId, Datum>().asMutable();
  const fields = Set<string>().asMutable();

  datums.forEach((datum) => {
    byIds.set(getDatumId(datum), datum);
    forOwn(datum, (value, prop) => fields.add(prop));
  });

  // Don't modify idSymbol or rawDataSymbol
  fields.remove(idSymbol).remove(rawDataSymbol);

  // Modify fields
  fields.forEach((field) => {
    vegaSet.modify(
      (datum) => (byIds.has(getDatumId(datum)) && field in datum),
      field,
      (datum) => datum[field]
    );
  });
}


// Vega `changeset` interface
export interface RawVegaChangeSet<T> {
  insert(items: T[]): this;
  remove(items: T[] | ((item: T) => boolean)): this;
  modify<V>(
    item: T | ((item: T) => boolean),
    field: string,
    value: V | ((item: T) => V)
  ): this;
}

// Vega `changeset` wrapper class
// NOTE: `instanceof` does NOT work for this class
export class VegaChangeSet<T>
  extends (vega.changeset as { new(): RawVegaChangeSet<any> })
  implements RawVegaChangeSet<T> {
  constructor() {
    return super() as any;
  }

  static fromDinoChangeSet<T>(
    dinoSet: DinoChangeSet<T>
  ): VegaChangeSet<Datum<T>> {
    const vegaSet = new VegaChangeSet();
    insertDatums(vegaSet, dinoSet.insert);
    removeDatums(vegaSet, dinoSet.remove);
    modifyDatums(vegaSet, dinoSet.update);
    removeDatums(vegaSet, dinoSet.replace);
    insertDatums(vegaSet, dinoSet.replace);

    return vegaSet;
  }
}
