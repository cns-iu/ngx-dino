import { List } from 'immutable';

import { Flags, State, BaseOperator, BaseCache } from '../../base';


// Constants
const flags = Flags.combine(
  Flags.Stateless, Flags.SideEffectFree, Flags.InputIndependent
);


export class ConstantOperator<T> extends BaseOperator<any, T> {
  constructor(readonly value: T) {
    super(flags);
  }

  protected getImpl(data: any, cache: BaseCache): T {
    return this.value;
  }

  protected getStateImpl(): State {
    return List.of(this.value);
  }
}
