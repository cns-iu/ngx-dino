import { List } from 'immutable';

import { State, ImmutableValue } from '../../common';
import { BaseCache, Operator } from '../../operators';

// Do NOT use DataType or Field as values! Will cause circular dependency.
// Allowed to be used as types.
import { DataType, Field } from './field';


export class BoundField<T> extends ImmutableValue {
  private constructor(
    readonly id: string,
    readonly field: Field<T>,
    readonly operator: Operator<any, T>
  ) {
    super();
  }


  // Forward accesses/calls to field and operator
  get label(): string {
    return this.field.label;
  }

  get dataType(): DataType {
    return this.field.dataType;
  }

  get(data: any, cache?: BaseCache): T {
    return this.operator.get(data, cache);
  }

  get getter(): (data: any) => T {
    return this.operator.getter;
  }


  // ImmutableValue implementation
  protected getState(): State {
    return List.of<any>(this.id, this.field, this.operator);
  }
}
