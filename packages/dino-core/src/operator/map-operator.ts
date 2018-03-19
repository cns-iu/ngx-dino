import { Collection, List } from 'immutable';

import { BaseOperator } from './base-operator';


export class MapOperator<In, Out> extends BaseOperator<In, Out> {
  constructor(readonly mapper: (data: In) => Out) {
    super(true);
  }

  protected getImpl(data: In): Out {
    return this.mapper(data);
  }

  protected getStateImpl(): Collection<any, any> {
    return List.of(this.mapper);
  }
}
