import { BaseOperator } from '../base/base';
import { Operator } from '../operator';


export function unwrap<In, Out>(op: BaseOperator<In, Out>): BaseOperator<In, Out> {
  return (op as Operator<In, Out>).wrapped || op;
}
