import { Operator as OperatorClass } from '../../../operator';
import { combine as combineFun } from '../../../methods/grouping/combine';

declare module '../../../operator' {
    namespace Operator {
      let combine: typeof combineFun;
    }
}

OperatorClass.combine = combineFun;
