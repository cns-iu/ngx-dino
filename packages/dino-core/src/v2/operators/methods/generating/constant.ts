import { Operator } from '../../operator';
import { ConstantOperator } from '../../classes/generating/constant';
import { create } from '../../utility/create';


export function constant<T>(value: T): Operator<any, T> {
  return create(ConstantOperator, value);
}
