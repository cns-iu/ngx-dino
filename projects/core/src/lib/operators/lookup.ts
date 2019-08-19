import { get } from 'lodash';

import { Operator } from '../operator';

export function lookup<TMap>(mapping: TMap): Operator<keyof TMap, TMap[keyof TMap]>;
export function lookup<TMap, TDef>(mapping: TMap, defaultValue: TDef): Operator<keyof TMap, TMap[keyof TMap] | TDef>;
export function lookup<TKey extends PropertyKey, TVal>(mapping: Record<TKey, TVal>): Operator<TKey, TVal>;
export function lookup<TKey extends PropertyKey, TVal, TDef>(mapping: Record<TKey, TVal>, defaultValue: TDef): Operator<TKey, TVal | TDef>;

/**
 * Creates an `Operator` that will look up values in a provided mapping.
 *
 * @param mapping The mapping object.
 * @param defaultValue Value returned if a key does not exist in the mapping.
 * @returns The looked up value or the default value.
 */
export function lookup<TMap, TDef>(
  mapping: TMap, defaultValue?: TDef
): Operator<keyof TMap, TMap[keyof TMap] | TDef> {
  return new Operator(key => get(mapping, key, defaultValue));
}
