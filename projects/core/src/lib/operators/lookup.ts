import { get } from 'lodash';

import { Operator } from '../operator';

export function lookup<TMap>(mapping: TMap): Operator<keyof TMap, TMap[keyof TMap]>;
export function lookup<TMap, TDef>(mapping: TMap, defaultValue: TDef): Operator<keyof TMap, TMap[keyof TMap] | TDef>;

/**
 *
 *
 * @param mapping
 * @param defaultValue
 * @returns
 */
export function lookup<TMap, TDef>(
  mapping: TMap, defaultValue?: TDef
): Operator<keyof TMap, TMap[keyof TMap] | TDef> {
  return new Operator(key => get(mapping, key, defaultValue));
}
