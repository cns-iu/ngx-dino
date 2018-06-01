import { Operator } from '../../operator';
import {
  PropertyPath,
  AccessorOperator
} from '../../classes/extracting/accessor';
import { create } from '../../utility/create';


export function access<Out>(
  path: PropertyPath, defaultValue?: Out
): Operator<any, Out> {
  return create(AccessorOperator, path, defaultValue);
}
