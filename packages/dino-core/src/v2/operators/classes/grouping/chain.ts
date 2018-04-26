import { List } from 'immutable';
import { chain } from 'lodash';

import { Flags, State, BaseOperator, BaseCache } from '../../base';
import { IdentityOperator } from '../extracting/identity';
import { unwrap } from '../../utility/unwrap';


// Constants
const emptyState = List.of({});


// Processing
interface ProcessResult {
  flags: Flags;
  operators: List<BaseOperator<any, any>>;
}

function processOps(
  operators: BaseOperator<any, any>[]
): BaseOperator<any, any>[] {
  const normOps = chain(operators)
    .compact() // Remove falsy values
    .map(unwrap) // Unwrap Operators
    // Remove identity operators
    .reject((o) => o instanceof IdentityOperator)
    // Flatten nested chain operators
    .flatMap((o) => o instanceof ChainOperator ? o.operators.toArray() : o)
    .value();

  return reduceOps(normOps);
}

function reduceOps(
  operators: BaseOperator<any, any>[]
): BaseOperator<any, any>[] {
  let prevII = false; // Previous operator was input independent
  return operators.reduceRight((ops, op) => {
    if (!prevII || !op.flags.has(Flags.SideEffectFree)) {
      ops.push(op);
      prevII = op.flags.has(Flags.InputIndependent);
    }
    return ops;
  }, []).reverse();
}

function mergeFlags(operators: List<BaseOperator<any, any>>): Flags {
  const flags = operators.map((op) => op.flags);
  const firstOp = operators.first();
  const inputIndependent = firstOp && firstOp.flags.has(Flags.InputIndependent);

  return Flags.All
    .and(...flags.toArray())
    .or(inputIndependent ? Flags.InputIndependent : Flags.None);
}


export class ChainOperator<In, Out> extends BaseOperator<In, Out> {
  readonly operators: List<BaseOperator<any, any>>;

  constructor(...operators: BaseOperator<any, any>[]) {
    super();

    this.operators = List(processOps(operators));
    super.setFlags(mergeFlags(this.operators));
  }

  getImpl(data: In, cache: BaseCache): Out {
    return this.operators.reduce((result: any, op) => {
      return cache.get(op, result);
    }, data) as Out;
  }

  getStateImpl(): State {
    return this.operators.size !== 0 ? this.operators : emptyState;
  }
}
