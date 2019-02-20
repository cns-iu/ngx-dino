import {
  cond as loCond,
  constant as loConstant,
  flow as loFlow,
  forEach as loForEach,
  identity as loIdentity,
  isArray,
  Many,
  matches as loMatches,
  reduce as loReduce,
  stubTrue,
} from 'lodash';

import { Callable } from '../common/callable';

/**
 * A unary function type.
 */
export type UnaryFunction<TArgument = any, TResult = any> = (value: TArgument) => TResult;

/**
 * An `Operator` or an `UnaryFunction`.
 */
export type OperatorOrFunction<TArgument = any, TResult = any> = Operator<TArgument, TResult> | UnaryFunction<TArgument, TResult>;

/**
 * `Operator`'s get implementation selector function.
 */
const getImplSelector = loCond<UnaryFunction[], UnaryFunction>([
  [loMatches({ length: 0 }), loConstant(loIdentity)],
  [loMatches({ length: 1 }), functions => functions[0]],
  [stubTrue, loFlow]
]);

/**
 * `Operator` is a collection of `UnaryFunction`s that will be invoked in sequence
 * whenever a value is evaluated.
 */
export class Operator<TArgument, TResult> extends Callable<[TArgument], TResult> {
  /**
   * An array of `UnaryFunction`s that will be invoke (in order) on calls to `get`.
   */
  readonly functions: ReadonlyArray<UnaryFunction<any, any>>;

  /**
   * Optimized implementation of `get`.
   */
  private readonly getImpl: UnaryFunction<TArgument, TResult>;

  /**
   * Creates an new instance of `Operator`.
   *
   * @param functions Functions that will be invoked on `get`.
   */
  constructor(...functions: Many<OperatorOrFunction>[]) {
    super('getImpl');

    const normFunctions = normalize(functions);
    this.functions = normFunctions;
    this.getImpl = getImplSelector(normFunctions);
  }

  /**
   * Passes provided value through each of this `Operator`'s `UnaryFunction`s and
   * returns the result.
   *
   * @param value The value to process.
   * @returns The result of passing value through each `UnaryFunction`.
   */
  get(value: TArgument): TResult { return this.getImpl(value); }

  // tslint:disable:max-line-length
  pipe(): this;
  pipe<T1>(op: Many<OperatorOrFunction<TResult, T1>>): Operator<TResult, T1>;
  pipe<T1, T2>(op1: Many<OperatorOrFunction<TResult, T1>>, op2: Many<OperatorOrFunction<T1, T2>>): Operator<TResult, T2>;
  pipe<T1, T2, T3>(op1: Many<OperatorOrFunction<TResult, T1>>, op2: Many<OperatorOrFunction<T1, T2>>, op3: Many<OperatorOrFunction<T2, T3>>): Operator<TResult, T3>;
  pipe<T1, T2, T3, T4>(op1: Many<OperatorOrFunction<TResult, T1>>, op2: Many<OperatorOrFunction<T1, T2>>, op3: Many<OperatorOrFunction<T2, T3>>, op4: Many<OperatorOrFunction<T3, T4>>): Operator<TResult, T4>;
  pipe<T1, T2, T3, T4, T5>(op1: Many<OperatorOrFunction<TResult, T1>>, op2: Many<OperatorOrFunction<T1, T2>>, op3: Many<OperatorOrFunction<T2, T3>>, op4: Many<OperatorOrFunction<T3, T4>>, op5: Many<OperatorOrFunction<T4, T5>>): Operator<TResult, T5>;
  pipe<T1, T2, T3, T4, T5, T6>(op1: Many<OperatorOrFunction<TResult, T1>>, op2: Many<OperatorOrFunction<T1, T2>>, op3: Many<OperatorOrFunction<T2, T3>>, op4: Many<OperatorOrFunction<T3, T4>>, op5: Many<OperatorOrFunction<T4, T5>>, op6: Many<OperatorOrFunction<T5, T6>>): Operator<TResult, T6>;
  // tslint:enable:max-line-length

  /**
   * Creates a new `Operator` with the passed `OperatorOrFunction`s added to the existing functions array.
   *
   * @param ops The `OperatorOrFunction`s to add.
   * @returns The new `Operator` instance.
   */
  pipe<TResult1>(...ops: Many<OperatorOrFunction>[]): this | Operator<TResult, TResult1> {
    const functions = normalize(ops);
    return functions.length === 0 ? this : this.lift<TResult, TResult1>(this.functions.concat(functions));
  }

  /**
   * Creates a new `Operator` subclass instance.
   *
   * @param functions The functions for the new `Operator`.
   * @returns A new `Operator` instance with the same class as `this`.
   */
  protected lift<TArgument1, TResult1>(functions: UnaryFunction[]): Operator<TArgument1, TResult1> {
    return new Operator<TArgument1, TResult1>(functions);
  }
}

/**
 * Normalizes an array of `Operator`s, `UnaryFunction`s, or arrays of such into an array of `UnaryFunction`s.
 *
 * @param functions The mixed type array.
 * @returns A array of `UnaryFunction`s.
 */
function normalize(functions: Many<OperatorOrFunction>[]): UnaryFunction[] {
  function append(acc: UnaryFunction[], item: OperatorOrFunction): void {
    if (item instanceof Operator) {
      acc.push.apply(acc, item.functions);
    } else {
      acc.push(item);
    }
  }

  return loReduce(functions, (acc: UnaryFunction[], item: Many<OperatorOrFunction>): UnaryFunction[] => {
    if (isArray(item)) {
      loForEach(item, (subitem: OperatorOrFunction): void => append(acc, subitem));
    } else {
      append(acc, item as OperatorOrFunction);
    }

    return acc;
  }, []);
}
