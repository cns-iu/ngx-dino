import { Operator, UnaryFunction } from '@ngx-dino/core';

/**
 * Creates an `Operator` that passes values through the provided mapping function.
 *
 * @param func The mapping function.
 */
export function map<TArgument, TResult>(func: UnaryFunction<TArgument, TResult>): Operator<TArgument, TResult> {
  return new Operator(func);
}
