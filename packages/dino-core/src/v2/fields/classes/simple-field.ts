import { Seq } from 'immutable';

import { Operator } from '../../operators';
import { State, FieldArgs, Field, BoundField } from '../base';
import { makeBoundField } from '../utility/make-bound-field';


export interface SimpleFieldArgs<T> extends FieldArgs {
  defaultId?: string;
  operator: Operator<any, T>;
}

export class SimpleField<T> extends Field<T> {
  readonly defaultId?: string;
  readonly operator: Operator<any, T>;
  private boundField: BoundField<T>;

  constructor(args: SimpleFieldArgs<T>) {
    super(args);

    ({
      defaultId: this.defaultId,
      operator: this.operator
    } = args);
    this.boundField = makeBoundField(this.defaultId, this, this.operator);
  }


  // Abstract method implementations
  protected getAllBoundFields(): Seq.Keyed<string, BoundField<T>> {
    return Seq.Keyed([
      [undefined, this.boundField],
      [this.defaultId, this.boundField]
    ]);
  }
}
