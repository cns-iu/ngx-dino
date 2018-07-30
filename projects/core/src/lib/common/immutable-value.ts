import { Collection, is } from 'immutable';


export type State = Collection<any, any>;
export abstract class ImmutableValue {
  private cachedState: State;


  // Methods to override in derived classes
  protected abstract getState(): State;


  // Implementation for immutable interface
  equals(other: any): boolean {
    if (other instanceof ImmutableValue) {
      return is(this.getCachedState(), other.getCachedState());
    }
    return false;
  }

  hashCode(): number {
    return this.getCachedState().hashCode();
  }


  // Utility
  private getCachedState(): State {
    return this.cachedState || (this.cachedState = this.getState());
  }
}
