import { Operator as OperatorClass } from '../../../operator';
import { lookup as lookupFun } from '../../../methods/extracting/lookup';
import { fromStatic } from '../../../utility/instance-method';

declare module '../../../operator' {
  interface Operator<In, Out> {
    lookup<V>(collection: Iterable<[Out, V]>, defaultValue?: V): Operator<In, V>;
    lookup(collection: Iterable<Iterable<Out>>, defaultValue?: Out): Operator<In, Out>;
  }
}

OperatorClass.prototype.lookup = fromStatic(lookupFun);
