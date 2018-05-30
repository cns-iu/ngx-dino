import { Operator } from '../../operator';
import { ChainOperator } from '../../classes/grouping/chain';
import { create } from '../../utility/create';


export function chain<T>(): Operator<T, T>;
export function chain<In, Out>(op: Operator<In, Out>): Operator<In, Out>;
export function chain<In, Inter, Out>(
  first: Operator<In, Inter>, second: Operator<Inter, Out>
): Operator<In, Out>;
export function chain<In, Inter1, Inter2, Out>(
  first: Operator<In, Inter1>, second: Operator<Inter1, Inter2>,
  third: Operator<Inter2, Out>
): Operator<In, Out>;
export function chain<Out, In>(
  first: Operator<In, any>, ...rest: Operator<any, any>[]
): Operator<In, Out>;
export function chain(...ops: Operator<any, any>[]): Operator<any, any> {
  return create(ChainOperator, ...ops);
}
