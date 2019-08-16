import { Operator } from '../operator';

/**
 * Generates automatic identifiers.
 *
 * @param [prefix] The prefix of the identifier.
 * @param [start] The start index.
 * @returns An `Operator` providing a new identifier on each call.
 */
export function autoId(prefix = '', start = 0): Operator<unknown, string> {
  return new Operator(() => `${prefix}${start++}`);
}
