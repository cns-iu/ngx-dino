import { Collection } from 'immutable';
import { isFunction } from 'lodash';

import { OperatorFlags } from '../base/operator-flags';
import { BaseOperator } from '../base/base-operator';


export class MockOperator<In = any, Out = any> extends BaseOperator<In, Out> {
  readonly value: (data: In) => Out;
  readonly state: () => Collection<any, any>;

  constructor(
    value?: ((data: In) => Out) | Out,
    state?: (() => Collection<any, any>) | Collection<any, any>,
    flags: OperatorFlags = OperatorFlags.None
  ) {
    super(flags);

    this.value = isFunction(value) ? value : () => value;
    this.state = isFunction(state) ? state : () => state;
  }


  public getImpl(data: In): Out {
    return this.value(data);
  }

  public getStateImpl(): Collection<any, any> {
    return this.state();
  }
}
