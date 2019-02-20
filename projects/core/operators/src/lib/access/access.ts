import { Operator } from '@ngx-dino/core';
import { get as loGet, PropertyPath } from 'lodash';

/**
 * Creates an `Operator` that gets a value at the specified path.
 *
 * @param path Path to the value in the object.
 * @param [defaultValue] Value to return if any part of the path does not exist.
 */
export function access<TObject = any, TValue = any>(path: PropertyPath, defaultValue?: TValue): Operator<TObject, TValue> {
  return new Operator((obj: any): any => loGet(obj, path, defaultValue));
}
