import { Operator as OperatorClass } from '../../operator';
import '../static/chain';


declare module '../../operator' {
  interface Operator<In, Out> {
    chain<NewOut>(operator: Operator<Out, NewOut>): Operator<In, NewOut>;
    chain<NewOut = any>(
      first: Operator<Out, any>, ...rest: Operator<any, any>[]
    ): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.chain = function (...ops) {
  return OperatorClass.chain(this, ...ops);
};
