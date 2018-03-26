import { Operator as OperatorClass } from '../../operator';
import { Schema } from '../../grouping/combine';
import '../static/combine';
import './chain';


declare module '../../Operator' {
  interface Operator<In, Out> {
    combine<NewOut = any>(schema: Schema): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.combine = function (schema) {
  return this.chain(OperatorClass.combine(schema));
};
