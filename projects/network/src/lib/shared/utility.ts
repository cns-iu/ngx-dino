import { has, isArray, isNumber } from 'lodash';

export type Point = [number, number];
export type Range = number | [number, number] | {min: number, max: number};


export function isPoint(obj: any): obj is Point {
  return isArray(obj) && obj.length === 2;
}

export function isRange(obj: any): obj is Range {
  return (
    isNumber(obj) ||
    (isArray(obj) && obj.length === 2) ||
    (has(obj, 'min') && has(obj, 'max'))
  );
}


export function normalizeRange(range: Range): {min: number, max: number} {
  if (isNumber(range)) {
    return {min: 0, max: range};
  } else if (isArray(range)) {
    return {min: range[0], max: range[1]};
  } else {
    return range;
  }
}
