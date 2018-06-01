import { Operator as OperatorClass } from '../../../operator';
import { access as accessFun } from '../../../methods/extracting/access';

declare module '../../../operator' {
    namespace Operator {
      let access: typeof accessFun;
    }
}

OperatorClass.access = accessFun;
