import { Operator } from '@ngx-dino/core';

/**
 * Creates an `Operator` that returns the same value on every invocation.
 *
 * @param value The constant value.
 */
export function constant<TValue>(value: TValue): Operator<any, TValue> {
  return new Operator((): TValue => value);
}
