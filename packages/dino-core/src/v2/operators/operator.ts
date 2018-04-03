import { Collection } from 'immutable';

import { ICache } from './base/ibase-operator';
import { BaseOperator } from './base/base-operator';
import { NoopCache } from './caches/noop-cache';


export class Operator<In, Out> extends BaseOperator<In, Out> {
  private cachedGetter: (data: In) => Out;

  constructor(readonly wrapped: BaseOperator<In, Out>) {
    super(wrapped.flags);

    // No deep nesting
    if (wrapped instanceof Operator) {
      return wrapped;
    }
  }


  // Override base class methods
  protected getImpl(data: In, cache: ICache): Out {
    return this.wrapped.get(data, cache);
  }

  protected getStateImpl(): Collection<any, any> {
    return this.wrapped.getState();
  }

  rawBaseOperator(): BaseOperator<In, Out> {
    return this.wrapped;
  }

  get(data: In, cache?: ICache): Out {
    return (cache || NoopCache.instance).get(this.wrapped, data);
  }


  // Binding
  get getter(): (data: In) => Out {
    return this.cachedGetter || (this.cachedGetter = this.get.bind(this));
  }
}
