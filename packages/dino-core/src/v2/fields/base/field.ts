import { uniqueId } from 'lodash';

import { State, ImmutableValue } from '../../common';
import { Operator } from '../../operators';
import { BoundField } from './bound-field';


export { State };

export enum DataType {
  Any = 'any'
}


export interface FieldArgs {
  id?: string;
  label: string;
  dataType?: DataType;
}


export abstract class Field<T> extends ImmutableValue {
  readonly id: string;
  readonly label: string;
  readonly dataType: DataType = DataType.Any;

  constructor(args: FieldArgs) {
    super();

    ({
      id: this.id = uniqueId('field_'),
      label: this.label,
      dataType: this.dataType = DataType.Any
    } = args);
  }


  // Methods to overrride in derived classes
  abstract getBoundFieldIds(): string[];
  abstract getBoundField(id?: string): BoundField<T>;
}
