import { BaseOperator } from '../../base-operator';
import { Operator } from '../../operator';


interface OperatorConstructor<In, Out> {
  new (...args: any[]): BaseOperator<In, Out>;
}

export function create<In, Out>(
  type: OperatorConstructor<In, Out>, ...args: any[]
): Operator<In, Out> {
  return new Operator(new type(...args));
}
