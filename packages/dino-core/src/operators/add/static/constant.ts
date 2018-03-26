import { Operator as OperatorClass } from '../../operator';
import { ConstantOperator } from '../../generating/constant';
import { create } from '../internal/create';


function staticConstant<T>(value: T): OperatorClass<any, T> {
  return create(ConstantOperator, value);
}


// Export onto Operator
declare module '../../Operator' {
  namespace Operator {
    let constant: typeof staticConstant;
  }
}

OperatorClass.constant = staticConstant;
