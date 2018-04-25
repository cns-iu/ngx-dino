import { isFunction } from 'lodash';

import { Flags } from '../../base/flags';
import { Operator } from '../../operator';
import { Mapper, MapOperator } from '../../classes/transforming/map';
import { create } from '../../utility/create';


// Constants
const defaultFlags = Flags.combine(Flags.Stateless, Flags.SideEffectFree);


export function map<In, Out>(
  mapper: Mapper<In, Out>, ...args: any[]
): Operator<In, Out>;
export function map<In, Out>(
  flags: Flags, mapper: Mapper<In, Out>, ...args: any[]
): Operator<In, Out>;
export function map(...args: any[]): Operator<any, any> {
  if (isFunction(args[0])) {
    return create(MapOperator, defaultFlags, ...args);
  } else {
    return create(MapOperator, ...args);
  }
}
