import { defaults, get as deepGet } from 'lodash';

export interface IField<T> {
  name: string;
  label: string;
  datatype?: string;
  kind?: string;

  get(item: any): T;
}

export interface FieldOptions<T> {
  name: string;
  label: string;
  datatype?: string;

  accessor?: (item: any) => any | T;
  transform?: (value: any | T) => T;
  default?: T;
}

export class Field<T> implements IField<T> {
  public readonly name: string;
  public readonly label: string;
  public readonly datatype: string;

  public readonly accessor?: (item: any) => any | T;
  public readonly transform?: (value: any | T) => T;
  public readonly default?: T;

  constructor(options: FieldOptions<T>) {
    defaults(this, options, {
      datatype: 'string'
    });
  }

  get(item: any): T {
    item = item || {};
    const value = this.accessor ? this.accessor(item) : deepGet(item, this.name);

    if (value != null) {
      return this.transform ? this.transform(value) : value;
    } else {
      return this.default != null ? this.default : value;
    }
  }
}
