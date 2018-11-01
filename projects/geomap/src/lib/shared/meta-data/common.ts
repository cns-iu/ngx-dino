import { isArray, isFunction, isNaN, isNumber, once } from 'lodash';
import { OperatorFunction, Observable, from, isObservable, of, } from 'rxjs';
import { concatAll, concatMap, map, toArray } from 'rxjs/operators';

export type MetaSelector = number | string;
export namespace MetaSelector {
  export function normalize(selector: MetaSelector): MetaSelector {
    const asNumber = Number(selector);
    return isNumber(selector) || !isNaN(asNumber) ? asNumber : selector.toLowerCase().normalize();
  }
}

export type MultiMetaSelector = MetaSelector | MetaSelector[];
export namespace MultiMetaSelector {
  export function normalize(selectors: MultiMetaSelector): MetaSelector[] {
    const selectorArray = isArray(selectors) ? selectors : [selectors];
    return selectorArray.map(MetaSelector.normalize);
  }

  export function innerMap<T>(
    project: (selector: MetaSelector) => (T | Observable<T>)
  ): OperatorFunction<MultiMetaSelector, T[]> {
    return source => source.pipe(
      map(normalize),
      concatMap(selectors => from(selectors).pipe(
        map(project),
        map(value => isObservable(value) ? value : of(value)),
        concatAll(),
        toArray()
      ))
    );
  }
}

export type LookupTable<T extends Record<K, number | string>, K extends number | string> = Record<T[K], T>;
export namespace LookupTable {
  export function create<T extends Record<K, number | string>, K extends number | string>(
    objects: T[], key: K
  ): LookupTable<T, K> {
    return objects.reduce((table: LookupTable<T, K>, obj: T) => {
      const id = MetaSelector.normalize(obj[key]);
      table[id] = obj;
      return table;
    }, Object.create(null));
  }

  export function createLazy<T extends Record<K, number | string>, K extends number | string>(
    dataOrFun: T[] | (() => T[]), key: K
  ): () => LookupTable<T, K> {
    return once(() => {
      const data = isFunction(dataOrFun) ? dataOrFun() : dataOrFun;
      const table = create(data, key);
      return table;
    });
  }
}
