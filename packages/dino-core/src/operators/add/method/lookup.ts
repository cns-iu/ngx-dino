import { Operator as OperatorClass } from '../../operator';
import { MappingArg } from '../../extracting/lookup';
import '../static/lookup';
import './chain';


declare module '../../Operator' {
  interface Operator<In, Out> {
    lookup<NewOut>(
      mapping: MappingArg<Out, NewOut>, defaultValue?: NewOut
    ): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.lookup = function (mapping, defaultValue?) {
  return this.chain(OperatorClass.lookup(mapping, defaultValue));
};
