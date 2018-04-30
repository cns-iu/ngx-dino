import { Seq, List, Map } from 'immutable';
import { uniqueId } from 'lodash';

import { State, ImmutableValue } from '../../common';
import { Operator } from '../../operators';
import { BoundField } from './bound-field';


export { State };

export enum DataType {
  Boolean = 'boolean',
  Number = 'number',
  String = 'string',
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
  readonly dataType: DataType;
  private boundFieldsMapping: Map<string, BoundField<T>> = undefined;

  constructor(args: FieldArgs) {
    super();

    ({
      id: this.id = uniqueId('field_'),
      label: this.label,
      dataType: this.dataType = DataType.Any
    } = args);
  }


  // Methods to overrride in derived classes
  protected abstract getAllBoundFields(): Seq.Keyed<string, BoundField<T>>;


  // Public interface
  getBoundFieldIds(): Seq.Indexed<string> {
    return this.getBoundFieldsMap()
      .keySeq()
      .filter((id) => id !== undefined)
      .valueSeq();
  }

  getBoundField(id?: string): BoundField<T> {
    return this.getBoundFieldsMap().get(id);
  }


  // ImmutableValue implementation
  protected getState(): State {
    const operatorMap = this.getBoundFieldsMap().map((bf) => bf.operator);
    return List.of<any>(this.dataType, operatorMap);
  }


  // Internal utility
  private getBoundFieldsMap(): Map<string, BoundField<T>> {
    if (this.boundFieldsMapping === undefined) {
      this.boundFieldsMapping = Map(this.getAllBoundFields());
    }

    return this.boundFieldsMapping;
  }
}
