import { Collection, List } from 'immutable';

import { BaseOperator } from '../base-operator';


export class MapOperator<In, Out> extends BaseOperator<In, Out> {
  readonly args: any[];
  private readonly callArgs: any[];

  constructor(readonly mapper: (data: In) => Out, ...args: any[]) {
    super(true);

    this.args = args;

    // Used to prevent the creation of a new array of arguments on each
    // invocation of get. This works fine since javascript is single threaded!
    this.callArgs = [undefined].concat(args);
  }

  protected getImpl(data: In): Out {
    this.callArgs[0] = data;
    return this.mapper.apply(undefined, this.callArgs);
  }

  protected getStateImpl(): Collection<any, any> {
    this.callArgs[0] = this.mapper;
    return List(this.callArgs);
  }
}
