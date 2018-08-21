export type Range<T> = [T, T] | {min: T, max: T};
export type Point = [number, number];


export function isPoint(obj: any): obj is Point {
  return Array.isArray(obj) && obj.length === 2;
}
