import { Operator } from '@ngx-dino/core';
import { get, PropertyPath } from 'lodash';

// tslint:disable:max-line-length
export function access<TObj extends object, TKey extends keyof TObj>(path: TKey | [TKey]): Operator<TObj, TObj[TKey]>;
export function access<TObj extends object, TKey extends keyof TObj, TDef>(path: TKey | [TKey], defaultValue: TDef): Operator<TObj, TObj[TKey] | TDef>;
export function access<TObj extends object, TKey1 extends keyof TObj, TKey2 extends keyof TObj[TKey1]>(path: [TKey1, TKey2]): Operator<TObj, TObj[TKey1][TKey2]>;
export function access<TObj extends object, TKey1 extends keyof TObj, TKey2 extends keyof TObj[TKey1], TDef>(path: [TKey1, TKey2], defaultValue: TDef): Operator<TObj, TObj[TKey1][TKey2] | TDef>;
export function access<TObj extends object, TKey1 extends keyof TObj, TKey2 extends keyof TObj[TKey1], TKey3 extends keyof TObj[TKey1][TKey2]>(path: [TKey1, TKey2, TKey3]): Operator<TObj, TObj[TKey1][TKey2][TKey3]>;
export function access<TObj extends object, TKey1 extends keyof TObj, TKey2 extends keyof TObj[TKey1], TKey3 extends keyof TObj[TKey1][TKey2], TDef>(path: [TKey1, TKey2, TKey3], defaultValue: TDef): Operator<TObj, TObj[TKey1][TKey2][TKey3] | TDef>;
export function access<TObj extends object, TKey1 extends keyof TObj, TKey2 extends keyof TObj[TKey1], TKey3 extends keyof TObj[TKey1][TKey2], TKey4 extends keyof TObj[TKey1][TKey2][TKey3]>(path: [TKey1, TKey2, TKey3, TKey4]): Operator<TObj, TObj[TKey1][TKey2][TKey3][TKey4]>;
export function access<TObj extends object, TKey1 extends keyof TObj, TKey2 extends keyof TObj[TKey1], TKey3 extends keyof TObj[TKey1][TKey2], TKey4 extends keyof TObj[TKey1][TKey2][TKey3], TDef>(path: [TKey1, TKey2, TKey3, TKey4], defaultValue: TDef): Operator<TObj, TObj[TKey1][TKey2][TKey3][TKey4] | TDef>;
export function access(path: PropertyPath, defaultValue?: any): Operator<unknown, unknown>;
// tslint:enable:max-line-length

export function access(path: PropertyPath, defaultValue?: any): Operator<unknown, unknown> {
  return new Operator(obj => get(obj, path, defaultValue));
}
