import { OperatorFunction } from '@ngx-dino/core';
import { get as loGet, PropertyPath } from 'lodash';

/**
 * Gets a value at the specified path.
 *
 * @param path Path to the value in the object.
 * @param [defaultValue] Value to return if any part of the path does not exist.
 */
export function access<TObject = any, TValue = any>(path: PropertyPath, defaultValue?: TValue): OperatorFunction<TObject, TValue> {
  return (obj: any): any => loGet(obj, path, defaultValue);
}
