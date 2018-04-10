import { Collection, List } from 'immutable';
import { isFunction } from 'lodash';

import { Flags } from '../base/flags';
import { BaseOperator, BaseCache } from '../base/base';


export class MockOperator<In = any, Out = any> extends BaseOperator<In, Out> {
  readonly value: (data: In, cache: BaseCache) => Out;
  readonly state: () => Collection<any, any>;

  constructor(
    value?: ((data: In, cache: BaseCache) => Out) | Out,
    state: (() => Collection<any, any>) | Collection<any, any> = List(),
    flags: Flags = Flags.None
  ) {
    super(flags);

    this.value = isFunction(value) ? value : () => value;
    this.state = isFunction(state) ? state : () => state;
  }


  public getImpl(data: In, cache: BaseCache): Out {
    return this.value(data, cache);
  }

  public getStateImpl(): Collection<any, any> {
    return this.state();
  }
}
