import { Operator as OperatorClass } from '../../../operator';
import { identity as identityFun } from '../../../methods/extracting/identity';

declare module '../../../operator' {
    namespace Operator {
      let identity: typeof identityFun;
    }
}

OperatorClass.identity = identityFun;
