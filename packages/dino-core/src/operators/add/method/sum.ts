import { sum as arraySum } from 'lodash';

import { Operator as OperatorClass } from '../../operator';
import './map';


declare module '../../Operator' {
  interface Operator<In, Out> {
    sum(): Operator<In, number>;
  }
}

OperatorClass.prototype.sum = function () {
  return this.map(arraySum);
};
