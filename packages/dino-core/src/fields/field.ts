import { Seq, List, Map } from 'immutable';
import { uniqueId } from 'lodash';

import {
  State, ImmutableValue, stringCompare, toStringHelper
} from '../common';
import { Operator } from '../operators';

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

export type FieldMappingArg<T, F = any> =
  Seq<string, Operator<F, T>> |
  Iterable<[string, Operator<F, T>]> |
  {[id: string]: Operator<F, T>};

export interface FieldArgs<T, F = any> extends BaseFieldArgs {
  mapping: FieldMappingArg<T, F>;
}


export class Field<T> extends ImmutableValue {
  static defaultSymbol = '__ngx-dino-field-default__';

  readonly id: string;
  readonly label: string;
  readonly dataType: DataType;
  readonly mapping: Map<string, BoundField<T>>;

  constructor(args: FieldArgs<T>) {
    super();

    let operatorMapping: FieldMappingArg<T>;
    ({
      id: this.id = uniqueId('field_'),
      label: this.label,
      dataType: this.dataType = DataType.Any,
      mapping: operatorMapping
    } = args);

    this.mapping = Seq.Keyed<string, Operator<any, T>>(operatorMapping)
      .map((op, id) => new (BoundField as any)(id, this, op)).toMap();

    // Bind the default to a BoundField with an equivalent Operator if possible
    if (this.mapping.has(Field.defaultSymbol)) {
      const op = this.mapping.get(Field.defaultSymbol).operator;
      const equiv = this.mapping.find((bf, key) => {
        return bf.operator.equals(op) && key !== Field.defaultSymbol;
      });

      if (equiv !== undefined) {
        this.mapping = this.mapping.set(Field.defaultSymbol, equiv);
      }
    }
  }


  // Public interface
  getBoundFieldIds(): Seq.Indexed<string> {
    return this.mapping
      .keySeq()
      .filter((id) => id !== Field.defaultSymbol)
      .valueSeq();
  }

  getBoundField(id: string = Field.defaultSymbol): BoundField<T> {
    return this.mapping.get(id);
  }


  // toString
  toString(): string {
    const operators = Seq.Keyed(
      this.mapping
        .filter((_value, key) => key !== Field.defaultSymbol)
        .map((bf) => bf.operator)
        .entrySeq()
        .sort(([k1], [k2]) => stringCompare(k1, k2))
    );
    const keywords = Seq.Keyed<string, any>([
      ['id', this.id],
      ['label', this.label],
      ['dataType', this.dataType],
      ['mapping', operators]
    ]);

    return toStringHelper('Field', keywords);
  }


  // ImmutableValue implementation
  protected getState(): State {
    const operatorMap = this.mapping.map((bf) => bf.operator);
    return List.of<any>(this.dataType, operatorMap);
  }
}
