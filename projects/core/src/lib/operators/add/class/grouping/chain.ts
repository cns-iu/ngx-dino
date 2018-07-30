import { Operator as OperatorClass } from '../../../operator';
import { chain as chainFun } from '../../../methods/grouping/chain';

declare module '../../../operator' {
    namespace Operator {
      let chain: typeof chainFun;
    }
}

OperatorClass.chain = chainFun;
