import { IField } from './field';

export type DatumId = string | number;

export function isDatumId(value: any): value is DatumId {
  const typeString = Object.prototype.toString.call(value).slice(8, -1);
  return typeString === 'String' || typeString === 'Number';
}

export function getDatumId<T>(
  value: DatumId | T, idKey: IField<DatumId>
): DatumId {
  return isDatumId(value) ? value : idKey.get(value);
}

export class Changes<T = any> {
  constructor(
    public add: T[] = [],
    public remove: (DatumId | T)[] = [],
    public update: [DatumId | T, Partial<T>][] = []
  ) {}
}
