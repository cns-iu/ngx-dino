import { List } from 'immutable';

import { Flags } from '../../base/flags';
import { State, BaseOperator, BaseCache } from '../../base/base';


export type Mapper<In, Out> = (data: In, ...args: any[]) => Out;
export class MapOperator<In, Out> extends BaseOperator<In, Out> {
  readonly args: any[];
  // Used during get/getState to reduce copying
  private readonly callArgs: any[];

  constructor(flags: Flags, readonly mapper: Mapper<In, Out>, ...args: any[]) {
    super(flags);

    this.args = args;
    this.callArgs = [undefined].concat(args);
  }

  protected getImpl(data: In, cache: BaseCache): Out {
    this.callArgs[0] = data;
    return this.mapper.apply(undefined, this.callArgs);
  }

  protected getStateImpl(): State {
    this.callArgs[0] = this.mapper;
    return List(this.callArgs);
  }
}
