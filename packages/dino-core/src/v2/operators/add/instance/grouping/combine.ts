import { Operator as OperatorClass } from '../../../operator';
import { Schema } from '../../../classes/grouping/combine';
import { combine as combineFun } from '../../../methods/grouping/combine';
import { fromStatic } from '../../../utility/instance-method';


declare module '../../../operator' {
  interface Operator<In, Out> {
    combine<NewOut>(schema: Schema): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.combine = fromStatic(combineFun);
