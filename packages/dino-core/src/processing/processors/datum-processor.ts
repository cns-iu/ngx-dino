import { Collection, Seq } from 'immutable';

import { BoundField } from '../../fields';
import { Datum, rawDataSymbol } from '../datums';


export class DatumProcessor<R, T extends Datum<R>> {
  constructor(
    readonly extracted: Collection.Keyed<string, BoundField<any>>,
    readonly computed: Collection.Keyed<string, BoundField<any>>
  ) { }


  process(datum: T): T {
    const rawData = datum[rawDataSymbol];
    this.extracted.forEach((bfield: any, prop) => {
      datum[prop] = bfield.get(rawData);
    });
    this.computed.forEach((bfield, prop) => {
      datum[prop] = bfield.get(datum);
    });

    return datum;
  }
}
