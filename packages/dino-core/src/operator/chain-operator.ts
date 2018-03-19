import { Collection, List } from 'immutable';

import { BaseOperator } from './base-operator';
import { IdentityOperator } from './identity-operator';


function normalizeOperator(
  op: BaseOperator<any, any>
): Iterable<BaseOperator<any, any>> {
  op = op.unwrap();

  if (op instanceof ChainOperator) {
    return op.operators as any;
  } else if (op instanceof IdentityOperator) {
    return [];
  } else {
    return [op];
  }
}


export class ChainOperator<In, Out> extends BaseOperator<In, Out> {
  readonly operators: List<BaseOperator<any, any>>;

  constructor(...operators: BaseOperator<any, any>[]) {
    super(true);

    this.operators = List(List(operators).flatMap(normalizeOperator));
  }

  protected getImpl(data: In): Out {
    const result = this.operators.reduce((value, op) => op.get(value), data);
    return result as any;
  }

  protected getStateImpl(): Collection<any, any> {
    return this.operators;
  }
}
