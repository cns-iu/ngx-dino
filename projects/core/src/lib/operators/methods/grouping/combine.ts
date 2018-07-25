import { Operator } from '../../operator';
import { Schema, CombineOperator } from '../../classes/grouping/combine';
import { create } from '../../utility/create';


export function combine<In, Out>(schema: Schema): Operator<In, Out> {
  return create<In, Out>(CombineOperator, schema);
}
