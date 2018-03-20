import { Collection, List } from 'immutable';

import { BaseOperator } from '../base-operator';
import { IdentityOperator } from '../extracting/identity';


function normalizeOperators(
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
    super(operators.every((op) => op.cachable));

    this.operators = List(List(operators).flatMap(normalizeOperators));
  }

  protected getImpl(data: In): Out {
    const result = this.operators.reduce((value, op) => op.get(value), data);
    return result as any;
  }

  protected getStateImpl(): Collection<any, any> {
    return this.operators;
  }
}
