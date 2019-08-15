import { Operator } from '../operator';

/**
 * Creates an `Operator` that returns the same value on every call.
 *
 * @param value The value.
 * @returns An `Operator` that evaluates to the same value on every call.
 */
export function constant<TVal>(value: TVal): Operator<unknown, TVal> {
  return new Operator(() => value);
}
