import { Operator } from '@ngx-dino/core';

/**
 * Returns the identity `Operator`.
 */
export function identity<T = any>(): Operator<T, T> {
  return new Operator();
}
