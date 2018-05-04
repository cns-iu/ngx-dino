import { Seq, Map } from 'immutable';

import { BoundField } from '../../fields';
import { DatumId } from '../datum-id';
import { Changes } from '../changes';
import { DatumCache } from './datum-cache';


export class ChangeCache<T> {
  constructor(
    field: BoundField<DatumId>,
    strictMode: boolean = false,
    readonly datumCache: DatumCache<T> = new DatumCache(field, strictMode)
  ) { }


  // Forward accesses
  get field(): BoundField<DatumId> {
    return this.datumCache.field;
  }

  get strictMode(): boolean {
    return this.datumCache.strictMode;
  }

  get map(): Map<DatumId, T> {
    return this.datumCache.map;
  }

  get datums(): Seq.Indexed<T> {
    return this.datumCache.datums;
  }

  setField(field: BoundField<DatumId>): ChangeCache<T> {
    const newDatumCache = this.datumCache.setField(field);
    return new ChangeCache(field, undefined, newDatumCache);
  }


  update(changes: Changes<T>): ChangeCache<T> {
    const newDatumCache = this.datumCache
      .insert(changes.insert)
      .remove(changes.remove)
      .update(changes.update)
      .replace(changes.replace);

    return new ChangeCache(this.field, undefined, newDatumCache);
  }
}
