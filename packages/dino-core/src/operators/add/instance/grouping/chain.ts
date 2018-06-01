import { Operator as OperatorClass } from '../../../operator';
import { chain as chainFun } from '../../../methods/grouping/chain';
import { fromStatic } from '../../../utility/instance-method';

declare module '../../../operator' {
  interface Operator<In, Out> {
    chain(): Operator<In, Out>;
    chain<NewOut>(op: Operator<Out, NewOut>): Operator<In, NewOut>;
    chain<Inter, NewOut>(first: Operator<In, Inter>, second: Operator<Inter, NewOut>): Operator<In, NewOut>;
    chain<Inter1, Inter2, NewOut>(
      first: Operator<In, Inter1>, second: Operator<Inter1, Inter2>,
      third: Operator<Inter2, NewOut>
    ): Operator<In, NewOut>;
    chain<NewOut>(first: Operator<In, any>, ...rest: Operator<any, any>[]): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.chain = fromStatic(chainFun);
