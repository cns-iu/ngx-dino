import { Operator } from '../operator';

/**
 * Creates an identity `Operator`.
 *
 * @returns An empty identity `Operator`.
 */
export function identity<TArg, TRes>(): Operator<TArg, TRes> {
  return new Operator();
}
