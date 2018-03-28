import { Operator as OperatorClass } from '../../operator';
import { MapOperator } from '../../transforming/map';
import { create } from '../internal/create';


function staticMap<In, Out>(
  mapper: (data: In, ...args: any[]) => Out, ...args: any[]
): OperatorClass<In, Out> {
  return create(MapOperator, mapper, ...args);
}


// Export onto Operator
declare module '../../operator' {
  namespace Operator {
    let map: typeof staticMap;
  }
}

OperatorClass.map = staticMap;
