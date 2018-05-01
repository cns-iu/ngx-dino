import { Seq, Map, is } from 'immutable';
import { merge } from 'lodash';

import { BoundField } from '../../fields';
import { DatumId, extractId } from './../datum-id';


function toKVTuple<T>(field: BoundField<DatumId>, datum: T): [DatumId, T] {
  return [extractId(datum, field), datum];
}

function toKVTupleFor<T>(field: BoundField<DatumId>): (datum: T) => [DatumId, T] {
  return (datum) => toKVTuple(field, datum);
}


export class SimpleCache<T> {
  constructor(
    readonly field: BoundField<DatumId>,
    readonly map: Map<DatumId, T> = Map()
  ) { }


  get datums(): Seq.Indexed<T> {
    return this.map.valueSeq();
  }


  setField(newField: BoundField<DatumId>): SimpleCache<T> {
    if (is(newField, this.field)) {
      return this;
    }

    const newMap = Map<DatumId, T>(this.datums.map(toKVTupleFor(newField)));
    return new SimpleCache(newField, newMap);
  }


  insert(datums: T[]): SimpleCache<T> {
    if (datums.length === 0) {
      return this;
    }

    const newMap = this.map.mergeWith(
      (oldDatum) => oldDatum,
      Map(Seq.Indexed(datums).map(toKVTupleFor(this.field)))
    );
    return new SimpleCache(this.field, newMap);
  }

  remove(datums: (DatumId | T)[]): SimpleCache<T> {
    if (datums.length === 0) {
      return this;
    }

    const newMap = this.map.withMutations((map) => {
      datums.forEach((datum) => map.delete(extractId(datum, this.field)));
    });
    return new SimpleCache(this.field, newMap);
  }

  update(datums: [(DatumId | T), Partial<T>][]): SimpleCache<T> {
    if (datums.length === 0) {
      return this;
    }

    const newMap = this.map.withMutations((map) => {
      datums.forEach(([id, update]) => {
        map.update(extractId(id, this.field), (datum) => {
          return datum !== undefined ? merge({}, datum, update) : undefined;
        });
      });
    });
    return new SimpleCache(this.field, newMap);
  }

  replace(datums: [(DatumId | T), T][]): SimpleCache<T> {
    if (datums.length === 0) {
      return this;
    }

    const newMap = this.map.withMutations((map) => {
      datums.forEach(([id, newDatum]) => {
        map.update(extractId(id, this.field), () => newDatum);
      });
    });
    return new SimpleCache(this.field, newMap);
  }
}
