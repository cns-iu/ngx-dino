import { Operator as OperatorClass } from '../../../operator';
import { PropertyPath } from '../../../classes/extracting/accessor';
import { access as accessFun } from '../../../methods/extracting/access';
import { fromStatic } from '../../../utility/instance-method';


declare module '../../../operator' {
  interface Operator<In, Out> {
    access<NewOut>(path: PropertyPath, defaultValue?: NewOut): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.access = fromStatic(accessFun);
