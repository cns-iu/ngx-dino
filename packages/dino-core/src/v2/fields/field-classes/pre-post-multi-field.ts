import { Map, Iterable } from 'immutable';

import { Operator } from '../../operators';
import { chain } from '../../operators/methods/grouping/chain';
import {
  MultiFieldMappingArg, MultiFieldArgs,
  MultiField
} from './multi-field';


function applyPrePostOps<T>(
  args: PrePostMultiFieldArgs<T>
): PrePostMultiFieldArgs<T> {
  const {preOperation, postOperation, mapping} = args;
  if (preOperation === undefined && postOperation === undefined) {
    return args;
  }

  let newMapping: Iterable<string, Operator<any, any>> = Map(mapping);
  if (preOperation !== undefined) {
    newMapping = newMapping.map((op) => chain(preOperation, op));
  }
  if (postOperation !== undefined) {
    newMapping = newMapping.map((op) => chain(op, postOperation));
  }

  return Object.assign({}, args, {mapping: newMapping});
}



export interface PrePostMultiFieldArgs<T> extends MultiFieldArgs<T> {
  preOperation?: Operator<any, any>;
  postOperation?: Operator<any, T>;
  mapping: MultiFieldMappingArg<any>;
}

export class PrePostMultiField<T> extends MultiField<T> {
  readonly preOperation?: Operator<any, any>;
  readonly postOperation?: Operator<any, T>;

  constructor(args: PrePostMultiFieldArgs<T>) {
    super(applyPrePostOps(args));

    ({
      preOperation: this.preOperation,
      postOperation: this.postOperation
    } = args);
  }
}
