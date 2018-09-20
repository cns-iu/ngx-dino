import { List, Map, Record, fromJS } from 'immutable';
import { isFunction, isObject, cloneDeepWith } from 'lodash';

import { Flags, State, BaseOperator, BaseCache } from '../../base';
import { unwrap } from '../../utility/unwrap';


// Evaluation
type PropertyKey = number | string;

interface EvalArgs<S> {
  state: S;

  value: any;
  key: PropertyKey;
  owner: any;
  stack: any;
}

interface EvalResult {
  result?: any;
  remove?: boolean;
}

function evaluate<S>(
  obj: any, evaluator: (args: EvalArgs<S>) => EvalResult, state: S
): any {
  const removed = Map<any, List<PropertyKey>>().asMutable();
  const newObj = cloneDeepWith(obj,
    (value: any, key: PropertyKey, owner: any, stack: any) => {
      const args = {state, value, key, owner, stack};
      const {result, remove = false} = evaluator(args);

      if (remove && stack) {
        removed.update(stack.get(owner), (keys = List()) => keys.push(key));
        return value;
      }
      return result;
    }
  );

  removed.forEach((keys, item) => deleteValues(item, keys));
  return newObj;
}

function deleteValues(item: any, keys: List<PropertyKey>): void {
  if (isFunction(item.delete)) { // Javascript Map or Set
    keys.forEach(item.delete.bind(item));
  } else { // Object or Array
    keys.forEach((key) => (delete item[key]));
  }
}


// Cycle removal
class CycleRef extends Record({path: List()}) {
  constructor(path: List<PropertyKey>) {
    super({path});
  }
}

interface CycleState {
  paths: Map<any, List<PropertyKey>>;
  cycles: Map<any, CycleRef>;
}

function cycleEvaluator(
  {state, value, key, owner}: EvalArgs<CycleState>
): EvalResult {
  if (!isObject(value)) {
    return {};
  } else if (state.cycles.has(value)) {
    return {result: state.cycles.get(value)};
  }

  const parentPath = state.paths.get(owner);
  const path = key ? parentPath.push(key) : List<PropertyKey>();
  const ref = new CycleRef(path);
  state.paths.set(value, path);
  state.cycles.set(value, ref);

  return {};
}


// Information collection and normalization
interface InfoState {
  flags: Flags;
}

function normalizeEvaluator({state, value}: EvalArgs<InfoState>): EvalResult {
  if (value instanceof BaseOperator) {
    // Potential for eager evaluation here!
    state.flags = state.flags.and(value.flags);
    return {result: unwrap(value)};
  }
  return {};
}


// Operator evaluation
interface OpState<In> {
  data: In;
  cache: BaseCache;
}

function operatorEvaluator<In>(
  {state, value}: EvalArgs<OpState<In>>
): EvalResult {
  if (value instanceof BaseOperator) {
    const result = value.get(state.data, state.cache);
    return {result, remove: result === undefined};
  }
  return {};
}


export type Schema = object | any[];
export class CombineOperator<In, Out> extends BaseOperator<In, Out> {
  readonly schema: Schema;

  constructor(schema: Schema) {
    super();

    const state: InfoState = {flags: Flags.All};
    this.schema = evaluate(schema, normalizeEvaluator, state);
    super.setFlags(state.flags);
  }

  protected getImpl(data: In, cache: BaseCache): Out {
    const state: OpState<In> = {data, cache};
    return evaluate(this.schema, operatorEvaluator, state);
  }

  protected getStateImpl(): State {
    const state: CycleState = {
      paths: Map<any, any>().asMutable(),
      cycles: Map<any, any>().asMutable()
    };
    return fromJS(evaluate(this.schema, cycleEvaluator, state));
  }
}
