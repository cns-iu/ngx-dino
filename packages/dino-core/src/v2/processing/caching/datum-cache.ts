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


export class DatumCache<T> {
  constructor(
    readonly field: BoundField<DatumId>,
    readonly strictMode: boolean = false,
    readonly map: Map<DatumId, T> = Map()
  ) { }


  get datums(): Seq.Indexed<T> {
    return this.map.valueSeq();
  }


  setField(newField: BoundField<DatumId>): DatumCache<T> {
    if (is(newField, this.field)) {
      return this;
    }

    const newMap = Map<DatumId, T>(this.datums.map(toKVTupleFor(newField)));
    return new DatumCache(newField, this.strictMode, newMap);
  }


  insert(datums: T[]): DatumCache<T> {
    if (datums.length === 0) {
      return this;
    }

    const newMap = this.map.mergeWith(
      (oldDatum, _newDatum, key) => {
        const message = `Item already inserted for key: ${key}`;
        return this.strictModeCheck(oldDatum === undefined, oldDatum, message);
      },
      Map(Seq.Indexed(datums).map(toKVTupleFor(this.field)))
    );
    return new DatumCache(this.field, this.strictMode, newMap);
  }

  remove(datums: (DatumId | T)[]): DatumCache<T> {
    if (datums.length === 0) {
      return this;
    }

    const newMap = this.map.withMutations((map) => {
      datums.forEach((datum) => {
        const key = extractId(datum, this.field);
        const message = `Cannot remove missing item for key: ${key}`;

        this.strictModeCheck(map.has(key), undefined, message);
        map.delete(key);
      });
    });
    return new DatumCache(this.field, this.strictMode, newMap);
  }

  update(datums: [(DatumId | T), Partial<T>][]): DatumCache<T> {
    if (datums.length === 0) {
      return this;
    }

    const newMap = this.map.withMutations((map) => {
      datums.forEach(([id, update]) => {
        const key = extractId(id, this.field);
        const message = `Cannot update missing item for key: ${key}`;

        map.update(key, (datum) => {
          if (this.strictModeCheck(datum !== undefined, true, message)) {
            return merge({}, datum, update);
          }
        });
      });
    });
    return new DatumCache(this.field, this.strictMode, newMap);
  }

  replace(datums: [(DatumId | T), T][]): DatumCache<T> {
    if (datums.length === 0) {
      return this;
    }

    const newMap = this.map.withMutations((map) => {
      datums.forEach(([id, newDatum]) => {
        map.update(extractId(id, this.field), () => newDatum);
      });
    });
    return new DatumCache(this.field, this.strictMode, newMap);
  }


  private strictModeCheck<U>(
    condition: boolean, value: U, message: string
  ): U {
    if (this.strictMode && !condition) {
      throw new Error(message);
    }
    return value;
  }
}
