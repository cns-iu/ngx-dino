import { Operator as OperatorClass } from '../../operator';
import { AutoIdOperator } from '../../generating/auto-id';
import { create } from '../internal/create';


function staticAutoId(
  prefix?: string, start?: number
): OperatorClass<any, string> {
  return create(AutoIdOperator, prefix, start);
}


// Export onto Operator
declare module '../../operator' {
  namespace Operator {
    let autoId: typeof staticAutoId;
  }
}

OperatorClass.autoId = staticAutoId;
