import { Operator as OperatorClass } from '../../operator';


declare module '../../operator' {
  interface Operator<In, Out> {
    identity(): Operator<In, Out>;
  }
}

OperatorClass.prototype.identity = function () {
  return this;
};
