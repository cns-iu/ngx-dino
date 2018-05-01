import { Seq } from 'immutable';

import { Operator } from '../../operators';
import { BaseFieldArgs, Field } from '../base';


export interface SimpleFieldArgs<T> extends BaseFieldArgs {
  bfieldId?: string;
  operator: Operator<any, T>;
}


export function simpleField<T>(args: SimpleFieldArgs<T>): Field<T> {
  const {bfieldId, operator} = args;
  const bidSeq = bfieldId ? {[bfieldId]: operator} : {};
  const mapping = Seq.Keyed<string, Operator<any, T>>({
    [Field.defaultSymbol]: operator
  }).concat(bidSeq).toSeq();
  const newArgs = {...args, mapping};

  return new Field(newArgs);
}
