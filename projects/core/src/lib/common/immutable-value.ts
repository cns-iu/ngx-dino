import { Collection, is } from 'immutable';


export type State = Collection<any, any>;

/**
 * Base class for immutable objects.
 *
 * Implements Immutable.js' `ValueObject` interface.
 */
export abstract class ImmutableValue {
  private cachedState: State;


  /**
   * Returns the immutable state of this value. Must be overridden in subclasses.
   *
   * The state is used to calculate both equality and hash code.
   *
   * @returns Any immutable value.
   */
  protected abstract getState(): State;


  /**
   * Value equality test.
   *
   * @param other The value to compare for equality.
   * @returns Whether `this` is considered equal to `other`
   */
  equals(other: any): boolean {
    if (this === other) {
      return true;
    } else if (other instanceof ImmutableValue) {
      return is(this.getCachedState(), other.getCachedState());
    } else {
      return false;
    }
  }


  /**
   * Calculates a hash code for this object.
   *
   * @returns The hash code for `this`
   */
  hashCode(): number {
    return this.getCachedState().hashCode();
  }


  /**
   * Fetches and caches the state on this object using `getState`.
   *
   * @returns The immutable value produced by `getState`
   */
  private getCachedState(): State {
    return this.cachedState || (this.cachedState = this.getState());
  }
}
