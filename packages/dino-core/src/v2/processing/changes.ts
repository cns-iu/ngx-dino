import { DatumId } from './datum-id';

export class Changes<T> {
  constructor(
    // Ignores already inserted values
    readonly insert: T[] = [],
    // Ignores values not inserted
    readonly remove: (T | DatumId)[] = [],
    // Ignores values not inserted
    readonly update: [(T | DatumId), Partial<T>][] = [],
    // Adds values not inserted
    readonly replace: [(T | DatumId), T][] = []
  ) { }

  static fromArray<T>(insert: T[]): Changes<T> {
    return new Changes(insert);
  }
}
