import { isArray, reduce } from 'lodash';

import { Callable } from '../common/callable';

/**
 * A unary function type.
 */
export type OperatorFunction<Argument, Result> = (value: Argument) => Result;

/**
 * `Operator` is a collection of unary `OperatorFunction`s that will be in sequence
 * whenever a value is evaluated.
 *
 * @template From Argument type for `Operator.get`.
 * @template To Result type of `Operator.get`.
 */
export class Operator<From, To> extends Callable<[From], To> {
  /**
   * An array of `OperatorFunction`s that will be invoke (in order) on calls.
   */
  readonly functions: ReadonlyArray<OperatorFunction<any, any>>;

  /**
   * Constructs a new `Operator` instance from an array of `OperatorFunction`s.
   *
   * @param [functions] `OperatorFunction`s for this `Operator`.
   */
  constructor(functions?: ReadonlyArray<OperatorFunction<any, any>>);

  /**
   * Constructs a new `Operator` instance from zero or more `OperatorFunction`s.
   *
   * @param functions Zero or more `OperatorFunction`s for this `Operator`.
   */
  constructor(...functions: OperatorFunction<any, any>[]);

  constructor(...functions: any[]) {
    super('get'); // NOTE: Possible optimization opportunity. Delegate to different impl depending on # functions.
    this.functions = functions.length === 1 && isArray(functions[0]) ? functions[0] : functions;
  }

  /**
   * Passes provided value through each of this `Operator`'s `OperatorFunction`s and
   * returns the result.
   *
   * @param value The value to process.
   * @returns The result of passing value through each `OperatorFunction`.
   */
  get(value: From): To {
    return reduce(this.functions, (current, fun) => fun(current), value);
  }

  // tslint:disable:max-line-length
  pipe(): this;
  pipe<T1>(op: OperatorFunction<From, T1>): Operator<From, T1>;
  pipe<T1, T2>(op1: OperatorFunction<From, T1>, op2: OperatorFunction<T1, T2>): Operator<From, T2>;
  pipe<T1, T2, T3>(op1: OperatorFunction<From, T1>, op2: OperatorFunction<T1, T2>, op3: OperatorFunction<T2, T3>): Operator<From, T3>;
  pipe<T1, T2, T3, T4>(op1: OperatorFunction<From, T1>, op2: OperatorFunction<T1, T2>, op3: OperatorFunction<T2, T3>, op4: OperatorFunction<T3, T4>): Operator<From, T4>;
  pipe<T1, T2, T3, T4, T5>(op1: OperatorFunction<From, T1>, op2: OperatorFunction<T1, T2>, op3: OperatorFunction<T2, T3>, op4: OperatorFunction<T3, T4>, op5: OperatorFunction<T4, T5>): Operator<From, T5>;
  pipe<T1, T2, T3, T4, T5, T6>(op1: OperatorFunction<From, T1>, op2: OperatorFunction<T1, T2>, op3: OperatorFunction<T2, T3>, op4: OperatorFunction<T3, T4>, op5: OperatorFunction<T4, T5>, op6: OperatorFunction<T5, T6>): Operator<From, T6>;
  // tslint:enable:max-line-length

  /**
   * Creates a new `Operator` with the passed `OperatorFunction`s added to the existing functions array.
   *
   * @param ops The `OperatorFunction`s to add.
   * @returns The new `Operator` instance.
   */
  pipe<NewTo>(...ops: OperatorFunction<any, any>[]): Operator<From, NewTo> {
    return ops.length > 0 ? new Operator(this.functions.concat(ops)) : this as Operator<From, any>;
  }
}
