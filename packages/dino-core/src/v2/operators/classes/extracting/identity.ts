import { Collection, List } from 'immutable';

import { Flags } from '../../base/flags';
import { BaseOperator, BaseCache } from '../../base/base';


// Constants
const flags = Flags.combine(Flags.Stateless, Flags.SideEffectFree);
const state = List.of({});


export class IdentityOperator<T> extends BaseOperator<T, T> {
  constructor() {
    super(flags);
  }

  getImpl(data: T, cache: BaseCache): T {
    return data;
  }

  getStateImpl(): Collection<any, any> {
    return state;
  }
}
