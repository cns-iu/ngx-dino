import { Seq, List, Map } from 'immutable';
import { uniqueId } from 'lodash';

import { State, ImmutableValue } from '../../common';
import { Operator } from '../../operators';

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


  // ImmutableValue implementation
  protected getState(): State {
    const operatorMap = this.mapping.map((bf) => bf.operator);
    return List.of<any>(this.dataType, operatorMap);
  }
}
