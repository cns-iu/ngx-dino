import { OperatorFunction } from '@ngx-dino/core';
import { get as loGet, isMap, isWeakMap } from 'lodash';

export function lookup<TValue>(
  mapping: Record<PropertyKey, TValue>, defaultValue?: TValue
): OperatorFunction<PropertyKey, TValue>;
export function lookup<TKey, TValue>(
  mapping: Map<TKey, TValue>, defaultValue?: TValue
): OperatorFunction<TKey, TValue>;
export function lookup<TKey extends object, TValue>(
  mapping: WeakMap<TKey, TValue>, defaultValue?: TValue
): OperatorFunction<TKey, TValue>;

/**
 * Creates an `OperatorFunction` that looks up values in the provided mapping.
 *
 * @param mapping The mapping on which to do lookups.
 * @param defaultValue Value that should be returned in case the key does not exist in the `mapping`.
 */
export function lookup<TKey, TValue>(mapping: any, defaultValue?: TValue): OperatorFunction<TKey, TValue> {
  if (isMap(mapping) || isWeakMap(mapping)) {
    return (key: any): TValue => {
      if (!mapping.has(key)) { return defaultValue; }
      return mapping.get(key);
    };
  } else {
    return (key: any): TValue => loGet(mapping, key, defaultValue);
  }
}
