import { Operator as OperatorClass } from '../../../operator';


declare module '../../../operator' {
  interface Operator<In, Out> {
    identity(): this;
  }
}

OperatorClass.prototype.identity = function () {
  return this;
};
