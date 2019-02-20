import { flow as loFlow, forEach as loForEach, identity as loIdentity, isArray, Many, reduce as loReduce } from 'lodash';

import { Callable } from '../common/callable';

/**
 * A unary function type.
 */
export type UnaryFunction<TArgument, TResult> = (value: TArgument) => TResult;

/**
 * An `Operator` or an `UnaryFunction`.
 */
export type OperatorOrFunction<TArgument, TResult> = Operator<TArgument, TResult> | UnaryFunction<TArgument, TResult>;

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
  constructor(...functions: Many<OperatorOrFunction<any, any>>[]) {
    super('getImpl');

    const funcs = this.functions = normalize(functions);
    switch (funcs.length) {
      case 0:
        this.getImpl = loIdentity;
        break;

      case 1:
        this.getImpl = funcs[0];
        break;

      default:
        this.getImpl = loFlow(funcs);
        break;
    }
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
  pipe<T1>(op: OperatorOrFunction<TResult, T1>): Operator<TResult, T1>;
  pipe<T1, T2>(op1: OperatorOrFunction<TResult, T1>, op2: OperatorOrFunction<T1, T2>): Operator<TResult, T2>;
  pipe<T1, T2, T3>(op1: OperatorOrFunction<TResult, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>): Operator<TResult, T3>;
  pipe<T1, T2, T3, T4>(op1: OperatorOrFunction<TResult, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>): Operator<TResult, T4>;
  pipe<T1, T2, T3, T4, T5>(op1: OperatorOrFunction<TResult, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>): Operator<TResult, T5>;
  pipe<T1, T2, T3, T4, T5, T6>(op1: OperatorOrFunction<TResult, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>, op6: OperatorOrFunction<T5, T6>): Operator<TResult, T6>;
  // tslint:enable:max-line-length

  /**
   * Creates a new `Operator` with the passed `OperatorOrFunction`s added to the existing functions array.
   *
   * @param ops The `OperatorOrFunction`s to add.
   * @returns The new `Operator` instance.
   */
  pipe<TResult1>(...ops: Many<OperatorOrFunction<any, any>>[]): this | Operator<TResult, TResult1> {
    const functions = normalize(ops);
    return functions.length === 0 ? this : this.lift<TResult, TResult1>(this.functions.concat(functions));
  }

  /**
   * Creates a new `Operator` subclass instance.
   *
   * @param functions The functions for the new `Operator`.
   * @returns A new `Operator` instance with the same class as `this`.
   */
  protected lift<TArgument1, TResult1>(functions: UnaryFunction<any, any>[]): Operator<TArgument1, TResult1> {
    return new Operator<TArgument1, TResult1>(functions);
  }
}

/**
 * Normalizes an array of `Operator`s, `UnaryFunction`s, or arrays of such into an array of `UnaryFunction`s.
 *
 * @param functions The mixed type array.
 * @returns A array of `UnaryFunction`s.
 */
function normalize(functions: Many<OperatorOrFunction<any, any>>[]): UnaryFunction<any, any>[] {
  type Accumulator = UnaryFunction<any, any>[];
  type Item = Many<OperatorOrFunction<any, any>>;

  function append(acc: Accumulator, item: OperatorOrFunction<any, any>): void {
    if (item instanceof Operator) {
      acc.push.apply(acc, item.functions);
    } else {
      acc.push(item);
    }
  }

  return loReduce(functions, (acc: Accumulator, item: Item): Accumulator => {
    if (isArray(item)) {
      loForEach(item, (subitem: OperatorOrFunction<any, any>): void => append(acc, subitem));
    } else {
      append(acc, item as OperatorOrFunction<any, any>);
    }

    return acc;
  }, []);
}
