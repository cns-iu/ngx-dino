import {
  cond as loCond,
  filter as loFilter,
  flatMap as loFlatMap,
  fromPairs as loFromPairs,
  isArray,
  isMap,
  isObjectLike,
  map as loMap,
  stubTrue as loStubTrue,
  toPairs as loToPairs,
  uniqBy as loUniqBy,
} from 'lodash';

import { Callable } from '../common/callable';
import { OperatorEntry, OperatorGroup, OperatorMap } from './types';

/**
 * Type of many `ItemTransformer` arguments.
 */
export type ItemTransformerArgument<TSource = any, TTarget = any> =
  OperatorEntry<TSource, TTarget[keyof TTarget]> |
  OperatorGroup<TSource, TTarget[keyof TTarget]> |
  OperatorMap<TSource, TTarget[keyof TTarget]>;

/**
 * `normalize`'s flattening selector function.
 */
const normalizeSelector = loCond<ItemTransformerArgument, OperatorEntry[]>([
  [isArray, (entry: OperatorEntry) => [entry]],
  [isMap, (map: OperatorMap) => Array.from<OperatorEntry>(map)],
  [isObjectLike, loToPairs], // Must appear after other more specific object types.
  [loStubTrue, arg => { throw new TypeError(`Invalid ItemTransformer argument: ${arg}`); }]
]);

/**
 * Normalizes an array of `ItemTransformerArgument`s into an array of `OperatorEntry`s.
 *
 * @param entries An array of mixed type entries.
 * @returns An array of `PropertyPath` and `Operator` pairs.
 */
function normalize<TSource, TTarget>(
  entries: ItemTransformerArgument<TSource, TTarget>[]
): OperatorEntry<TSource, TTarget[keyof TTarget]>[] {
  type Entry = OperatorEntry<TSource, TTarget[keyof TTarget]>;
  return loFlatMap(entries, normalizeSelector);
}

/**
 * A class for transforming an object into another one where each property is calculated by
 * applying the corresponding `Operator`.
 */
export class ItemTransformer<TSource = any, TTarget = any> extends Callable<[TSource], TTarget> {
  /**
   * `Operator`s that will be applied during `tranform`.
   */
  readonly entries: ReadonlyArray<OperatorEntry<TSource, TTarget[keyof TTarget]>>;

  /**
   * Creates a new `ItemTransformer` instance.
   * Duplicate entries are skipped.
   *
   * @param entries Properties and their corresponding `Operator`s.
   */
  constructor(...entries: ItemTransformerArgument<TSource, TTarget>[]) {
    super('transform');
    this.entries = loUniqBy(normalize(entries), 0);
  }

  /**
   * Creates a new `ItemTransformer` with additional entries.
   *
   * @param entries The entries to add. Existing entries are skipped.
   * @returns The new `ItemTransformer`.
   */
  add(...entries: ItemTransformerArgument<TSource, TTarget>[]): ItemTransformer<TSource, TTarget> {
    return new ItemTransformer(...this.entries, ...entries);
  }

  /**
   * Creates a new `ItemTransformer` with some entries replaces.
   *
   * @param entries The entries to replace. Non-existing entries are skipped.
   * @returns The new `ItemTransformer`.
   */
  replace(...entries: ItemTransformerArgument<TSource, TTarget>[]): ItemTransformer<TSource, TTarget> {
    const normEntries = normalize(entries);
    const entryMap = loFromPairs(normEntries);
    const newEntries = loMap(this.entries, entry => {
      const [key] = entry;
      if (key in entryMap) { return [key, entryMap[key as any]] as OperatorEntry; }
      return entry;
    });

    return new ItemTransformer(...newEntries);
  }

  /**
   * Creates a new `ItemTransformer` with entries for specified keys removed.
   *
   * @param keys The entry keys to remove. Non-existing keys are skipped.
   * @returns The new `ItemTransformer`.
   */
  remove(...keys: PropertyKey[]): ItemTransformer<TSource, TTarget> {
    const keySet = new Set(keys);
    const newEntries = loFilter(this.entries, ([key]) => !keySet.has(key));
    return new ItemTransformer(...newEntries);
  }

  /**
   * Creates a new `ItemTransformer` with only the entries for the specified keys.
   *
   * @param keys The entry keys to retain. Non-existing keys are skipped.
   * @returns The new `ItemTransformer`.
   */
  retain(...keys: PropertyKey[]): ItemTransformer<TSource, TTarget> {
    const keySet = new Set(keys);
    const newEntries = loFilter(this.entries, ([key]) => keySet.has(key));
    return new ItemTransformer(...newEntries);
  }

  /**
   * Produces a new item by applying all `Operator`s.
   *
   * @param item The item to transform.
   * @returns A new object.
   */
  transform(item: TSource): TTarget {
    return loFromPairs(loMap(this.entries, ([key, op]) => [key, op(item)])) as TTarget;
  }
}
