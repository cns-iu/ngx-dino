import { Collection, List } from 'immutable';

import { Flags } from '../../base/flags';
import { BaseOperator, BaseCache } from '../../base/base';


// Constants
const flags = Flags.combine(
  Flags.Stateless, Flags.SideEffectFree, Flags.InputIndependent
);


export class ConstantOperator<T> extends BaseOperator<any, T> {
  constructor(readonly constant: T) {
    super(flags);
  }

  protected getImpl(data: any, cache: BaseCache): T {
    return this.constant;
  }

  protected getStateImpl(): Collection<any, any> {
    return List.of(this.constant);
  }
}
