import { Operator as OperatorClass } from '../../../operator';
import { lookup as lookupFun } from '../../../methods/extracting/lookup';

declare module '../../../operator' {
    namespace Operator {
      let lookup: typeof lookupFun;
    }
}

OperatorClass.lookup = lookupFun;
