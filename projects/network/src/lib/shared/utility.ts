import { SimpleChanges } from '@angular/core';
import { conforms, conformsTo, isArrayLike, isNil, isNumber } from 'lodash';

export type Point = [number, number];
export type Range = number | [number, number] | { min: number, max: number };

// Type tests
export const isPoint = conforms({
  [0]: isNumber, [1]: isNumber
}) as (obj: any) => obj is Point;

export function isRange(obj: any): obj is Range {
  if (isNumber(obj)) {
    return true;
  } else if (conformsTo(obj, { min: isNumber, max: isNumber })) {
    return true;
  } else if (conformsTo(obj, { [0]: isNumber, [1]: isNumber })) {
    return true;
  } else {
    return false;
  }
}


// Value normalization
export function normalizeRange(range: Range): { min: number, max: number } {
  if (isNumber(range)) {
    return { min: 0, max: range };
  } else if (isArrayLike(range)) {
    return { min: range[0], max: range[1] };
  } else {
    return range;
  }
}


// Other utility
export function setDefaultValue<C, K extends keyof C>(
  component: C, changes: SimpleChanges, property: K, defaultValue: C[K]
): void {
  const change = changes[property as string];
  if (change && isNil(change.currentValue)) {
    component[property] = defaultValue;
  }
}
