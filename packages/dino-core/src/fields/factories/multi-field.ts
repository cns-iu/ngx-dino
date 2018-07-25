import { Seq } from 'immutable';

import { Operator } from '../../operators';
import { chain } from '../../operators/methods/grouping/chain';

import { FieldArgs, Field } from '../field';


export interface MultiFieldArgs<T, F = any> extends FieldArgs<T, F> {
  defaultId?: string;
}

export interface PreOperationArg<T> {
  pre: Operator<any, T>;
}
export interface PostOperationArg<F, T> {
  post: Operator<F, T>;
}


export function multiField<T>(args: MultiFieldArgs<T>): Field<T> {
  const mapping = Seq.Keyed<string, Operator<any, T>>(args.mapping);
  const defaultId = args.defaultId;
  const defaultOperator = defaultId && mapping.get(defaultId);
  const defaultSeq = defaultOperator ? {
    [Field.defaultSymbol]: defaultOperator
  } : {};
  const newMapping = mapping.concat(defaultSeq).toSeq();
  const newArgs = {...args, mapping: newMapping};

  return new Field(newArgs);
}

export function prePostMultiField<T>(args: MultiFieldArgs<T>): Field<T>;
export function prePostMultiField<T, Inter>(
  args: PreOperationArg<Inter> & MultiFieldArgs<T, Inter> |
    PostOperationArg<Inter, T> & MultiFieldArgs<Inter>
): Field<T>;
export function prePostMultiField<T, Inter1, Inter2>(
  args: PreOperationArg<Inter1> & PostOperationArg<Inter2, T> &
    MultiFieldArgs<Inter2, Inter1>
): Field<T>;
export function prePostMultiField(
  args: PreOperationArg<any> & PostOperationArg<any, any> & MultiFieldArgs<any>
): Field<any> {
  const {pre, post, mapping} = args;
  const newMapping = Seq.Keyed<string, Operator<any, any>>(mapping)
    .map((op) => chain(pre, op, post)).toSeq();
  const newArgs = {...args, mapping: newMapping};

  return multiField(newArgs);
}
