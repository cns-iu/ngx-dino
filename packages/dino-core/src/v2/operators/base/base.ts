import { List } from 'immutable';
import { uniqueId } from 'lodash';

import { State, ImmutableValue } from '../../common/immutable-value';
import { Flags } from './flags';


export { State };
export abstract class BaseOperator<In, Out> extends ImmutableValue {
  readonly id: string = uniqueId('operator_');

  constructor(readonly flags: Flags = Flags.None) {
    super();
  }

  // Helper method for setting the flags after the super constructor call
  // It is only allowed to be called in the derived constructor
  protected setFlags(flags: Flags): void {
    (this as {flags: Flags}).flags = flags;
  }


  // Methods to override in derived classes
  protected abstract getImpl(data: In, cache: BaseCache): Out;
  protected abstract getStateImpl(): State;


  // Public interface
  get(data: In, cache: BaseCache): Out {
    try {
      cache.enter();
      return this.getImpl(data, cache);
    } finally {
      cache.exit();
    }
  }


  // ImmutableValue implementation
  getState(): State {
    return List.of<any>(this.flags, this.getStateImpl());
  }


  // toString
  // TODO
}


export abstract class BaseCache {
  // Methods to override in derived classes
  enter() { }
  exit() { }

  abstract get<In, Out>(op: BaseOperator<In, Out>, data: In): Out;
  clear() { }
}
