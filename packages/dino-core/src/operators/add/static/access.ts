import { Operator as OperatorClass } from '../../operator';
import { AccessorOperator, Path } from '../../extracting/accessor';
import { create } from '../internal/create';


function staticAccess<In = any, Out = any>(
  path: Path, defaultValue?: Out
): OperatorClass<In, Out> {
  return create(AccessorOperator, path, defaultValue);
}


// Export onto Operator
declare module '../../Operator' {
  namespace Operator {
    let access: typeof staticAccess;
  }
}

OperatorClass.access = staticAccess;
