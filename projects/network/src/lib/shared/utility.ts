import { has, isArray } from 'lodash';

export type Point = [number, number];
export type Range<T> = [T, T] | {min: T, max: T};


export function isPoint(obj: any): obj is Point {
  return isArray(obj) && obj.length === 2;
}

export function isRange<T>(obj: any): obj is Range<T> {
  return (
    (isArray(obj) && obj.length === 2) ||
    (has(obj, 'min') && has(obj, 'max'))
  );
}
