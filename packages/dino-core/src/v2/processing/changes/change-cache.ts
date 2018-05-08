import { Collection, Seq, Map } from 'immutable';
import { assign, bind } from 'lodash';

import { State, ImmutableValue } from '../../common';
import { DatumId, Datum, idSymbol, rawDataSymbol } from '../datums';
import { ChangeSet } from './change-set';


function datumSeqToKeyed<T>(
  datums: Collection.Indexed<Datum<T>>
): Seq.Keyed<DatumId, Datum<T>> {
  const kvPairs = Seq.Indexed<Datum<T>>(datums).map((d) => [d[idSymbol], d]);
  return Seq.Keyed(kvPairs);
}


export class ChangeCache<R> extends ImmutableValue {
  constructor(
    readonly strictMode: boolean = false,
    readonly items: Map<DatumId, Datum<R>> = Map()
  ) {
    super();
  }


  // Applies changes and returns a new cache
  update(changes: ChangeSet<R>): ChangeCache<R> {
    const boundMergeInsert = bind(this.mergeInsert, this);
    const boundMergeUpdate = bind(this.mergeUpdate, this);
    const boundMergeReplace = bind(this.mergeReplace, this);
    const boundRemoveItem = bind(this.removeItem, this);
    const newItems = this.items
      .mergeWith(boundMergeInsert, datumSeqToKeyed(changes.insert))
      .mergeWith(boundMergeUpdate, datumSeqToKeyed(changes.update) as any)
      .mergeWith(boundMergeReplace, datumSeqToKeyed(changes.replace))
      .withMutations((map) => changes.remove.forEach(boundRemoveItem));

    return new ChangeCache(this.strictMode, newItems);
  }

  clear(): ChangeCache<R> {
    return new ChangeCache(this.strictMode);
  }


  // Update utility
  private mergeInsert(
    oldValue: Datum<R>, newValue: Datum<R>, key: DatumId
  ): Datum<R> {
    const message = `Item already inserted for key: ${key}`;
    return this.checkStrict(oldValue === undefined, newValue, message);
  }

  private mergeUpdate(
    oldValue: Datum<R>, newValue: Datum<Partial<R>>, key: DatumId
  ): Datum<R> {
    if (oldValue === undefined) {
      const message = `Unable to update missing item for key: ${key}`;
      return this.checkStrict(false, undefined, message);
    }

    const oldData = oldValue[rawDataSymbol];
    const dataUpdates = newValue[rawDataSymbol];
    const mergedData = assign({}, oldData, dataUpdates);
    return new Datum(key, mergedData);
  }

  private mergeReplace(_oldValue: Datum<R>, newValue: Datum<R>): Datum<R> {
    return newValue;
  }

  private removeItem(map: Map<DatumId, Datum<R>>, item: Datum<R>): void {
    const id = item[idSymbol];
    const message = `Unable to remove missing item for key: ${id}`;
    this.checkStrict(map.has(id), map.delete(id), message);
  }


  // strictMode utility
  private checkStrict<T>(condition: boolean, value: T, message: string): T {
    if (this.strictMode && !condition) {
      throw new Error(message);
    }
    return value;
  }


  // ImmutableValue implementation
  protected getState(): State {
    return this.items;
  }
}
