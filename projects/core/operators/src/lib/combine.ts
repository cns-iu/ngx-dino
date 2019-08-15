import { isOperator, Operator } from '@ngx-dino/core';
import { cloneDeepWith } from 'lodash';

/** Resolves a combine spec. Replaces all `Operator`s with their result types. */
export type ResolveSpec<T> =
  T extends Operator<unknown, infer TRes> ? TRes :
    T extends object ? { [TKey in keyof T]: ResolveSpec<T[TKey]> } : T;

/**
 * Deeply clones a spec while calling and replacing `Operator`s with their results.
 *
 * @param spec The spec object.
 * @param data The data used to evaluate each `Operator`.
 * @returns The evaluated clone object.
 */
function deepCloneReplace<TSpec>(spec: TSpec, data: any): ResolveSpec<TSpec> {
  const remove: [object, PropertyKey][] = [];
  const clone = cloneDeepWith(spec, (value: any, key: PropertyKey, obj: any): any => {
    if (isOperator(value)) {
      const newValue = value(data);
      return newValue !== undefined ? newValue : remove.push([obj, key]);
    }
  });

  remove.forEach(([obj, key]) => delete obj[key]);
  return clone;
}

export function combine<TArg, TRes>(op: Operator<TArg, TRes>): Operator<TArg, TRes>;
export function combine<TSpec>(spec: TSpec): Operator<unknown, ResolveSpec<TSpec>>;

/**
 * Creates an `Operator` that evaluates all nested `Operator`s and produces a new object with the same structure.
 *
 * @param spec The nested spec object.
 * @returns An object with all `Operator`s evaluated.
 */
export function combine<TSpec>(spec: TSpec): Operator<unknown, ResolveSpec<TSpec>> {
  if (isOperator<unknown, ResolveSpec<TSpec>>(spec)) {
    return spec;
  }

  return new Operator(value => deepCloneReplace(spec, value));
}
