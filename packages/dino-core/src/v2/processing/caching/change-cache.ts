import { Seq } from 'immutable';

import { BoundField } from '../../fields';
import { DatumId } from '../datum-id';
import { Changes } from '../changes';
import { SimpleCache } from './simple-cache';


export class ChangeCache<T> {
  constructor(
    field: BoundField<DatumId>,
    readonly simpleCache: SimpleCache<T> = new SimpleCache(field)
  ) { }


  // Forward accesses
  get field(): BoundField<DatumId> {
    return this.simpleCache.field;
  }

  get datums(): Seq.Indexed<T> {
    return this.simpleCache.datums;
  }

  setField(field: BoundField<DatumId>): ChangeCache<T> {
    const newSimpleCache = this.simpleCache.setField(field);
    return new ChangeCache(field, newSimpleCache);
  }


  update(changes: Changes<T>): ChangeCache<T> {
    const newSimpleCache = this.simpleCache
      .insert(changes.insert)
      .remove(changes.remove)
      .update(changes.update)
      .replace(changes.replace);

    return new ChangeCache(this.field, newSimpleCache);
  }
}
