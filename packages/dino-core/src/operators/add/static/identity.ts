import { Operator as OperatorClass } from '../../operator';
import { IdentityOperator } from '../../extracting/identity';
import { create } from '../internal/create';


function staticIdentity<T = any>(): OperatorClass<T, T> {
  return create(IdentityOperator);
}


// Export onto Operator
declare module '../../Operator' {
  namespace Operator {
    let identity: typeof staticIdentity;
  }
}

OperatorClass.identity = staticIdentity;
