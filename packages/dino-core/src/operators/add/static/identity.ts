import { Operator as OperatorClass } from '../../operator';
import { IdentityOperator } from '../../extracting/identity';
import { create } from '../internal/create';


function staticIdentity<T = any>(): OperatorClass<T, T> {
  return create<T, T>(IdentityOperator);
}


// Export onto Operator
declare module '../../operator' {
  namespace Operator {
    let identity: typeof staticIdentity;
  }
}

OperatorClass.identity = staticIdentity;
