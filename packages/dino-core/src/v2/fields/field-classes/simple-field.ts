import { List } from 'immutable';

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


  // Implement abstract methods
  getState(): State {
    return List.of<any>(this.defaultId, this.operator);
  }

  getBoundFieldIds(): string[] {
    return this.defaultId ? [this.defaultId] : [];
  }

  getBoundField(id?: string): BoundField<T> {
    if (id === undefined || id === this.defaultId) {
      return this.boundField;
    }
    return undefined;
  }
}
