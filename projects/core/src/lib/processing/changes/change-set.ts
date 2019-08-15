import { Collection, Seq } from 'immutable';
import { curry } from 'lodash';

import { BoundField } from '../../fields';
import { Datum, DatumId, extractId } from '../datums';
import { RawChangeSet } from './raw-change-set';


function datumFromRaw<R>(bfield: BoundField<DatumId>, rawData: R): Datum<R> {
  return new Datum(extractId(rawData, bfield), rawData);
}

function datumFromKVPair<K, V>(
  bfield: BoundField<DatumId>, [key, value]: [K, V]
): Datum<V> {
  return new Datum(extractId(key, bfield), value);
}


// @dynamic
export class ChangeSet<R> {
  // tslint:disable-next-line:member-ordering
  static fromRawChangeSet = curry(<R>(
    bfield: BoundField<DatumId>,
    set: RawChangeSet<R>
  ): ChangeSet<R> => {
    const boundDatumFromRaw = datumFromRaw.bind(undefined, bfield);
    const boundDatumFromKVPair = datumFromKVPair.bind(undefined, bfield);

    const insert = Seq.Indexed(set.insert)
      .map<Datum<R>>(boundDatumFromRaw).toIndexedSeq();
    const remove = Seq.Indexed(set.remove)
      .map<Datum<undefined>>(boundDatumFromRaw).toIndexedSeq();
    const update = Seq.Indexed(set.update)
      .map<Datum<Partial<R>>>(boundDatumFromKVPair).toIndexedSeq();
    const replace = Seq.Indexed(set.replace)
      .map<Datum<R>>(boundDatumFromKVPair).toIndexedSeq();

    return new ChangeSet(insert, remove, update, replace);
  });


  constructor(
    // Existing items are NOT replaced
    readonly insert: Collection.Indexed<Datum<R>> = Seq.Indexed(),
    // Non-existing items are skipped
    readonly remove: Collection.Indexed<Datum<any>> = Seq.Indexed(),
    // Non-existing items are skipped
    readonly update: Collection.Indexed<Datum<Partial<R>>> = Seq.Indexed(),
    // Non-existing items are inserted
    readonly replace: Collection.Indexed<Datum<R>> = Seq.Indexed()
  ) { }
}
