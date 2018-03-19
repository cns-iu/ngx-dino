import { Collection, List } from 'immutable';

import { BaseOperator } from '../base-operator';


export class ConstantOperator<Out> extends BaseOperator<any, Out> {
  constructor(readonly value: Out) {
    super(true);
  }

  protected getImpl(data: any): Out {
    return this.value;
  }

  protected getStateImpl(): Collection<any, any> {
    return List.of(this.value);
  }
}
