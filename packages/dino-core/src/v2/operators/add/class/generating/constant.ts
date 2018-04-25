import { Operator as OperatorClass } from '../../../operator';
import { constant as constantFun } from '../../../methods/generating/constant';

declare module '../../../operator' {
    namespace Operator {
      let constant: typeof constantFun;
    }
}

OperatorClass.constant = constantFun;
