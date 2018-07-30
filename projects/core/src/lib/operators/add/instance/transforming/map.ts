import { Flags } from '../../../base/flags';
import { Operator as OperatorClass } from '../../../operator';
import { Mapper } from '../../../classes/transforming/map';
import { map as mapFun } from '../../../methods/transforming/map';
import { fromStatic } from '../../../utility/instance-method';


declare module '../../../operator' {
  interface Operator<In, Out> {
    map<NewOut>(mapper: Mapper<Out, NewOut>, ...args: any[]): Operator<In, NewOut>;
    map<NewOut>(flags: Flags, mapper: Mapper<Out, NewOut>, ...args: any[]): Operator<In, NewOut>;
  }
}

OperatorClass.prototype.map = fromStatic(mapFun);
