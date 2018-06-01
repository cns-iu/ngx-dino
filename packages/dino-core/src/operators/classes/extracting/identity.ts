import { List } from 'immutable';

import { Flags, State, BaseOperator, BaseCache } from '../../base';


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

  getStateImpl(): State {
    return state;
  }
}
