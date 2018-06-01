import { DatumId } from '../datums';


export class RawChangeSet<R = any> {
  static fromArray<R>(insert: R[]): RawChangeSet<R> {
    return new RawChangeSet(insert);
  }


  constructor(
    readonly insert: R[] = [],
    readonly remove: (DatumId | R)[] = [],
    readonly update: [DatumId | R, Partial<R>][] = [],
    readonly replace: [DatumId | R, R][] = []
  ) { }
}
