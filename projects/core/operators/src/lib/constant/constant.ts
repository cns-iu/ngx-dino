import { OperatorFunction } from '@ngx-dino/core';

/**
 * Creates an `OperatorFunction` that returns the same value on every invocation.
 *
 * @param value The constant value.
 */
export function constant<TValue>(value: TValue): OperatorFunction<any, TValue> {
  return (): TValue => value;
}
