import { Collection } from 'immutable';

import { State, BaseOperator, BaseCache } from './base/base';
import { NoopCache } from './caches/noop-cache';


export class Operator<In, Out> extends BaseOperator<In, Out> {
  private cachedGetter: (data: In) => Out;

  constructor(readonly wrapped: BaseOperator<In, Out>) {
    super(wrapped.flags);

    // No nesting wrapped operators
    if (wrapped instanceof Operator) {
      return wrapped;
    }
  }


  // Override base class methods
  protected getImpl(data: In, cache: BaseCache): Out {
    return (this.wrapped as any).getImpl(data, cache);
  }

  protected getStateImpl(): State {
    return (this.wrapped as any).getStateImpl();
  }

  get(data: In, cache: BaseCache = new NoopCache()): Out {
    return this.wrapped.get(data, cache);
  }


  // Binding for Operator#get. Makes it easier to use as a callback i.e.
  // [...].map(op.getter)
  get getter(): (data: In) => Out {
    if (this.cachedGetter === undefined) {
      this.cachedGetter = (data) => this.get(data);
    }
    return this.cachedGetter;
  }
}
