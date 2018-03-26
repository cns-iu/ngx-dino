import { Operator as OperatorClass } from '../../operator';
import { ChainOperator } from '../../grouping/chain';
import { create } from '../internal/create';
import './identity';


function staticChain<T = any>(): OperatorClass<T, T>;
function staticChain<In, Out>(op: OperatorClass<In, Out>): OperatorClass<In, Out>;
function staticChain<In, Out = any>(
  first: OperatorClass<In, any>, ...rest: OperatorClass<any, any>[]
): OperatorClass<In, Out>;
function staticChain(...ops: OperatorClass<any, any>[]): OperatorClass<any, any> {
  switch (ops.length) {
    case 0:
      return OperatorClass.identity();

    case 1:
      return ops[0];

    default:
      return create(ChainOperator, ...ops);
  }
}


// Export onto Operator
declare module '../../Operator' {
  namespace Operator {
    let chain: typeof staticChain;
  }
}

OperatorClass.chain = staticChain;
