import { Operator as OperatorClass } from '../../operator';
import { CombineOperator, Schema } from '../../grouping/combine';
import { create } from '../internal/create';


function staticCombine<In = any, Out = any>(
  schema: Schema
): OperatorClass<In, Out> {
  return create<In, Out>(CombineOperator, schema);
}


declare module '../../operator' {
  namespace Operator {
    let combine: typeof staticCombine;
  }
}

OperatorClass.combine = staticCombine;
