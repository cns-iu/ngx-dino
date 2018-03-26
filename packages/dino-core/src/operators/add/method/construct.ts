import { Operator as OperatorClass } from '../../operator';
import './map';


declare module '../../Operator' {
  interface Operator<In, Out> {
    construct<NewOut>(type: {new (args: Out): NewOut}): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.construct = function (type) {
  return this.map((args) => new type(args));
};
