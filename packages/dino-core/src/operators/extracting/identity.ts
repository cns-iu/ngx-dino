import { Collection, List } from 'immutable';

import { BaseOperator } from '../base-operator';


// A shared state makes all instances equal
const sharedState = List.of({});

export class IdentityOperator<T> extends BaseOperator<T, T> {
  constructor() {
    super(true);
  }

  protected getImpl(data: T): T {
    return data;
  }

  protected getStateImpl(): Collection<any, any> {
    return sharedState;
  }
}
