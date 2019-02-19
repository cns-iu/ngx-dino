import { OperatorFunction } from '@ngx-dino/core';

/**
 * Creates an `OperatorFunction` that passes values through the provided mapping function.
 *
 * @param func The mapping function.
 */
export function map<TValue, TResult>(func: (value: TValue) => TResult): OperatorFunction<TValue, TResult> {
  return func;
}
