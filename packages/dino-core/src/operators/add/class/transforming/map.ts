import { Operator as OperatorClass } from '../../../operator';
import { map as mapFun } from '../../../methods/transforming/map';

declare module '../../../operator' {
    namespace Operator {
      let map: typeof mapFun;
    }
}

OperatorClass.map = mapFun;
