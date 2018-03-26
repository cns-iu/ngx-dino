import { Collection } from 'immutable';

import { BaseOperator } from './base-operator';



export class Operator<In, Out> extends BaseOperator<In, Out> {
  constructor(private readonly wrapped: BaseOperator<In, Out>) {
    super(wrapped.cachable);

    if (wrapped instanceof Operator) {
      return wrapped; // Prevent wrapping a wrapper
    }
  }

  // Override base class methods
  protected getImpl(data: In): Out {
    return this.wrapped.get(data);
  }

  protected getStateImpl(): Collection<any, any> {
    return this.wrapped.getState();
  }

  unwrap(): BaseOperator<In, Out> {
    return this.wrapped;
  }
}
