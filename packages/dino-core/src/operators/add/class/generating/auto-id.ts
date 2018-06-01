import { Operator as OperatorClass } from '../../../operator';
import { autoId as autoIdFun } from '../../../methods/generating/auto-id';

declare module '../../../operator' {
    namespace Operator {
      let autoId: typeof autoIdFun;
    }
}

OperatorClass.autoId = autoIdFun;
