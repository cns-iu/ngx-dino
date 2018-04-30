import { Seq, Map } from 'immutable';

import { Operator } from '../../operators';
import { State, FieldArgs, Field, BoundField } from '../base';
import { makeBoundField } from '../utility/make-bound-field';


export type MultiFieldMappingArg<T> =
  Iterable<[string, Operator<any, T>]> |
  {[id: string]: Operator<any, T>};

export interface MultiFieldArgs<T> extends FieldArgs {
  defaultId?: string;
  mapping: MultiFieldMappingArg<T>;
}

export class MultiField<T> extends Field<T> {
  readonly defaultId?: string;
  readonly mapping: Map<string, BoundField<T>>;

  constructor(args: MultiFieldArgs<T>) {
    super(args);

    let rawMapping: MultiFieldMappingArg<T>;
    ({
      defaultId: this.defaultId,
      mapping: rawMapping
    } = args);
    this.mapping = Map<string, Operator<any, T>>(rawMapping).map((op, id) => {
      return makeBoundField(id, this, op);
    }).toMap();
  }


  // Abstract method implementations
  protected getAllBoundFields(): Seq.Keyed<string, BoundField<T>> {
    return this.mapping.toSeq();
  }
}
