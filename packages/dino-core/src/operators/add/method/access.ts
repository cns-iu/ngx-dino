import { Operator as OperatorClass } from '../../operator';
import { Path } from '../../extracting/accessor';
import '../static/access';


declare module '../../Operator' {
  interface Operator<In, Out> {
    access<NewOut>(path: Path, defaultValue?: NewOut): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.access = function (path, defaultValue?) {
  return this.chain(OperatorClass.access(path, defaultValue));
};
