import { forEach, uniqueId } from 'lodash';

import { Operator } from '../operator';
import { BoundField } from './bound-field';


export enum DataType {
  Boolean = 'boolean',
  Number = 'number',
  String = 'string',
  Any = 'any'
}


export interface BaseFieldArgs {
  id?: string;
  label: string;
  dataType?: DataType;
}

export interface FieldArgs<TRes, TArg = any> extends BaseFieldArgs {
  mapping: { [id: string]: Operator<TArg, TRes> };
}


export class Field<T> {
  static defaultSymbol = '__ngx-dino-field-default__';

  readonly id: string;
  readonly label: string;
  readonly dataType: DataType;
  readonly mapping: { [id: string]: BoundField<T> } = { };

  constructor(args: FieldArgs<T>) {
    let operatorMapping: { [id: string]: Operator<any, T> };
    ({
      id: this.id = uniqueId('field_'),
      label: this.label,
      dataType: this.dataType = DataType.Any,
      mapping: operatorMapping
    } = args);

    forEach(operatorMapping, (op, id) => {
      this.mapping[id] = new BoundField(id, this, op);
    });
  }


  // Public interface
  getBoundFieldIds(): string[] {
    return Object.keys(this.mapping).filter(id => id !== Field.defaultSymbol);
  }

  getBoundField(id: string = Field.defaultSymbol): BoundField<T> {
    return this.mapping[id];
  }


  // toString
  toString(): string {
    const ids = this.getBoundFieldIds().filter(id => id !== Field.defaultSymbol);
    const data = [
      `id: ${this.id}`,
      `label: ${this.label}`,
      `dataType: ${this.dataType}`,
      `boundIds: (${ids.join(' ')})`
    ];
    return `Field<${data.join(', ')}>`;
  }


  /**
   * Equals operator.
   *
   * @deprecated Support for comparing `Field`s will be dropped in the future.
   * @param other Another value.
   * @returns True if other === this.
   */
  equals(other: any): boolean {
    return this === other;
  }

  /**
   * Hashs code.
   *
   * @deprecated Support for hash code will be dropped in the future.
   * @returns The hash code.
   */
  hashCode(): number {
    return 0;
  }
}
