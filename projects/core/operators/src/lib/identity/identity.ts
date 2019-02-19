import { OperatorFunction } from '@ngx-dino/core';

/**
 * Returns an identity `OperatorFunction`.
 */
export function identity<T = any>(): OperatorFunction<T, T> {
  return (value: T): T => value;
}
