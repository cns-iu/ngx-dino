import { Operator } from '../../operator';
import { LookupOperator } from '../../classes/extracting/lookup';
import { create } from '../../utility/create';


export function lookup<K, V>(collection: Iterable<[K, V]>, defaultValue?: V): Operator<K, V>;
export function lookup<T>(collection: Iterable<Iterable<T>>, defaultValue?: T): Operator<T, T>;
export function lookup<V>(obj: {[key: string]: V}, defaultValue?: V): Operator<string, V>;
export function lookup(mapping: any, defaultValue?: any): Operator<any, any> {
  return create(LookupOperator, mapping, defaultValue);
}
