import { Collection, is } from 'immutable';
import { uniqueId } from 'lodash';


export abstract class BaseOperator<In, Out> {
  readonly id: string = uniqueId('operator_');
  private cachedState: Collection<any, any> = undefined;

  constructor(readonly cachable: boolean) { }

  // Methods to override in subclasses
  protected abstract getImpl(data: In): Out;
  protected abstract getStateImpl(): Collection<any, any>;
  public unwrap(): BaseOperator<In, Out> {
    return this;
  }

  // get and state methods
  get(data: In): Out {
    return this.getImpl(data);
  }

  getState(): Collection<any, any> {
    if (this.cachedState) {
      return this.cachedState;
    } else if (this.cachable) {
      return (this.cachedState = this.getStateImpl());
    } else {
      return this.getStateImpl();
    }
  }

  // equals and hashCode for use in immutable.js
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
