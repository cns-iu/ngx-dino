import { Operator } from '../../operator';
import { IdentityOperator } from '../../classes/extracting/identity';
import { create } from '../../utility/create';


export function identity<T>(): Operator<T, T> {
  return create(IdentityOperator);
}
