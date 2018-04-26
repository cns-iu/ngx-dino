import { Operator } from '../../operator';
import { AutoIdOperator } from '../../classes/generating/auto-id';
import { create } from '../../utility/create';


export function autoId(prefix?: string, start?: number): Operator<any, string> {
  return create(AutoIdOperator, prefix, start);
}
