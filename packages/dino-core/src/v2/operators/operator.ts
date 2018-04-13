import { Collection } from 'immutable';

import { BaseOperator, BaseCache } from './base/base';
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
    return this.wrapped.get(data, cache);
  }

  protected getStateImpl(): Collection<any, any> {
    return this.wrapped.getState();
  }

  get(data: In, cache: BaseCache = new NoopCache()): Out {
    return super.get(data, cache);
  }


  // Binding for Operator#get. Makes it easier to use as a callback i.e.
  // [...].map(op.getter)
  get getter(): (data: In) => Out {
    return this.cachedGetter || (this.cachedGetter = this.get.bind(this));
  }
}
