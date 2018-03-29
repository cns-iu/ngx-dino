import { Operator as OperatorClass } from '../../operator';
import {
  TypeConstructor, constructCallback
} from '../internal/construct-callback';
import './map';


declare module '../../operator' {
  interface Operator<In, Out> {
    construct<NewOut>(type: TypeConstructor<NewOut, Out>): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.construct = function (type) {
  return this.map(constructCallback, type);
};
