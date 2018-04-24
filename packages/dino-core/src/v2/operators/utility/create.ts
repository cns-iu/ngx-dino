import { BaseOperator } from '../base/base';
import { Operator } from '../operator';


export interface Constructor<In, Out> {
  new (...args: any[]): BaseOperator<In, Out>;
}

export function createRaw<In, Out>(
  type: Constructor<In, Out>, ...args: any[]
): BaseOperator<In, Out> {
  return new type(...args);
}

export function create<In, Out>(
  type: Constructor<In, Out>, ...args: any[]
): Operator<In, Out> {
  return new Operator(createRaw(type, ...args));
}
