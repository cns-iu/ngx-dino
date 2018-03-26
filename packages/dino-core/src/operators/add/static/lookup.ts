import { Operator as OperatorClass } from '../../operator';
import { LookupOperator, MappingArg } from '../../extracting/lookup';
import { create } from '../internal/create';


function staticLookup<In, Out>(
  mapping: MappingArg<In, Out>, defaultValue?: Out
): OperatorClass<In, Out> {
  return create(LookupOperator, mapping, defaultValue);
}


// Export onto Operator
declare module '../../operator' {
  namespace Operator {
    let lookup: typeof staticLookup;
  }
}

OperatorClass.lookup = staticLookup;
