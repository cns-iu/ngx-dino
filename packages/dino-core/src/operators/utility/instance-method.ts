import { Operator } from '../operator';
import '../add/class/grouping/chain';


export function fromStatic(
  sfun: (...args: any[]) => Operator<any, any>
): (this: Operator<any, any>, ...args: any[]) => Operator<any, any> {
  return function (...args: any[]) {
    return Operator.chain(this, sfun(...args));
  };
}
