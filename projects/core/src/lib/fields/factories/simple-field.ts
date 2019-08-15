import { Operator } from '../../operator';
import { BaseFieldArgs, Field } from '../field';


export interface SimpleFieldArgs<T> extends BaseFieldArgs {
  bfieldId?: string;
  operator: Operator<any, T>;
}


export function simpleField<T>(args: SimpleFieldArgs<T>): Field<T> {
  const {bfieldId, operator} = args;
  const bidSeq = bfieldId ? {[bfieldId]: operator} : {};
  const newArgs = { ...args, mapping: { ...bidSeq, [Field.defaultSymbol]: operator } };

  return new Field(newArgs);
}
