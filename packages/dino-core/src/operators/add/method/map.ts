import { Operator as OperatorClass } from '../../operator';
import '../static/map';
import './chain';


declare module '../../Operator' {
  interface Operator<In, Out> {
    map<NewOut>(mapper: (data: Out) => NewOut): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.map = function (mapper) {
  return this.chain(OperatorClass.map(mapper));
};
