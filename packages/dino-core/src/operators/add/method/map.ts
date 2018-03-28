import { Operator as OperatorClass } from '../../operator';
import '../static/map';
import './chain';


declare module '../../operator' {
  interface Operator<In, Out> {
    map<NewOut>(
      mapper: (data: Out) => NewOut, ...args: any[]
    ): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.map = function (mapper, ...args) {
  return this.chain(OperatorClass.map(mapper, ...args));
};
