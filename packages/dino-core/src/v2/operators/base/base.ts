import { Collection, is } from 'immutable';
import { uniqueId } from 'lodash';

import { Flags } from './flags';


export abstract class BaseOperator<In, Out> {
  readonly id: string = uniqueId('operator_');
  private cachedState: Collection<any, any> = undefined;

  constructor(readonly flags: Flags = Flags.None) { }


  // Methods to override in derived classes
  protected abstract getImpl(data: In, cache: BaseCache): Out;
  protected abstract getStateImpl(): Collection<any, any>;


  // Public interface
  get(data: In, cache: BaseCache): Out {
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


export abstract class BaseCache {
  // Methods to override in derived classes
  enter() { }
  exit() { }

  abstract get<In, Out>(op: BaseOperator<In, Out>, data: In): Out;
  clear() { }
}
