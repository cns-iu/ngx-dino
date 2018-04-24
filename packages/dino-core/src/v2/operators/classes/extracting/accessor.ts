import { Collection, List } from 'immutable';
import {
  PropertyPath,
  get as getDeepProperty,
  toPath as normalizeProperyPath
} from 'lodash';

import { Flags } from '../../base/flags';
import { BaseOperator, BaseCache } from '../../base/base';


// Constants
const flags = Flags.combine(Flags.Stateless, Flags.SideEffectFree);


export { PropertyPath };
export class AccessorOperator<Out> extends BaseOperator<any, Out> {
  constructor(readonly path: PropertyPath, readonly defaultValue: Out) {
    super(flags);
  }

  protected getImpl(data: any, cache: BaseCache): Out {
    return getDeepProperty(data, this.path, this.defaultValue);
  }

  protected getStateImpl(): Collection<any, any> {
    const pathList = List(normalizeProperyPath(this.path));
    return List.of<any>(pathList, this.defaultValue);
  }
}
