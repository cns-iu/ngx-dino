import { Operator as OperatorClass } from '../../operator';
import { MapOperator } from '../../transforming/map';
import { create } from '../internal/create';


function staticMap<In, Out>(
  mapper: (data: In) => Out
): OperatorClass<In, Out> {
  return create(MapOperator, mapper);
}


// Export onto Operator
declare module '../../Operator' {
  namespace Operator {
    let map: typeof staticMap;
  }
}

OperatorClass.map = staticMap;
