import { Collection, is } from 'immutable';
import { uniqueId } from 'lodash';

import { OperatorFlags } from './operator-flags';
import { IBaseOperator, ICache } from './ibase-operator';


export abstract class BaseOperator<In, Out> implements IBaseOperator<In, Out> {
  readonly id: string = uniqueId('operator_');
  private cachedState: Collection<any, any> = undefined;

  constructor(readonly flags: OperatorFlags) { }


  // Methods to override in derived classes
  protected abstract getImpl(data: In, cache: ICache): Out;
  protected abstract getStateImpl(): Collection<any, any>;

  public rawBaseOperator(): BaseOperator<In, Out> {
    return this;
  }


  // Implementation of Operator interface
  get(data: In, cache: ICache): Out {
    cache.enter();
    const result = this.getImpl(data, cache);
    cache.exit();

    return result;
  }

  getState(): Collection<any, any> {
    return this.cachedState || (this.cachedState = this.getStateImpl());
  }


  // Implementation of immutable value interface
  equals(other: any): boolean {
    if (other instanceof BaseOperator) {
      return is(this.getState(), other.getState());
    }

    return false;
  }

  hashCode(): number {
    return this.getState().hashCode();
  }
}
