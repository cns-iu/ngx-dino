import { mapValues } from 'lodash';

import { Operator } from '../../operator';
import { pipe } from '../../operators';
import { Field, FieldArgs } from '../field';


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
  const mapping = args.mapping;
  const defaultId = args.defaultId;
  const defaultOperator = defaultId && mapping[defaultId];
  const defaultSeq = defaultOperator ? {
    [Field.defaultSymbol]: defaultOperator
  } : {};
  const newMapping = { ...mapping, ...defaultSeq };
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
  const newMapping = mapValues(mapping, op => pipe(pre, op, post));
  const newArgs = {...args, mapping: newMapping};

  return multiField(newArgs);
}
