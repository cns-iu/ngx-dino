import { Operator, UnaryFunction } from '@ngx-dino/core';

/**
 * Provides the same functionality as the `Operator` constructor
 * but limited to a single function argument.
 *
 * @param func A function.
 * @returns The new `Operator`.
 */
export function map<TArg, TRes>(func: UnaryFunction<TArg, TRes>): Operator<TArg, TRes> {
  return new Operator(func);
}
