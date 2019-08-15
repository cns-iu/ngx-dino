import { cond, constant, flatMapDepth, flow, identity, isArray, isFunction, Many, matches, stubTrue } from 'lodash';

import { Callable } from '../common';

/** An unary function type. */
export type UnaryFunction<TArg = any, TRes = any> = (value: TArg) => TRes;

/** An `Operator` or an `UnaryFunction`. */
export type OperatorOrFunction<TArg = any, TRes = any> = Operator<TArg, TRes> | UnaryFunction<TArg, TRes>;

/** `Operator`'s get implementation selector function. */
const getImplSelector = cond<UnaryFunction[], UnaryFunction>([
  [matches({ length: 0 }), constant(identity)],
  [matches({ length: 1 }), functions => functions[0]],
  [stubTrue, flow]
]);

/** `normalize`'s flattening selector function. */
const normalizeSelector = cond<Many<OperatorOrFunction>, UnaryFunction[]>([
  // Note that `Operator` is also a function!
  // So the test for `Operator` MUST come before the test for functions.
  [isOperator, (op: Operator<any, any>) => op.functions as UnaryFunction[]],
  [isFunction, (func: UnaryFunction) => [func]],
  [isArray, normalize as (array: OperatorOrFunction[]) => UnaryFunction[]],
  [stubTrue, (arg: any) => { throw new TypeError(`Invalid Operator argument: ${arg}`); }]
]);

/**
 * Normalizes an array of `Operator`s, `UnaryFunction`s, or arrays of such into an array of `UnaryFunction`s.
 *
 * @param functions The mixed type array.
 * @returns A array of `UnaryFunction`s.
 */
function normalize(functions: Many<OperatorOrFunction>[]): UnaryFunction[] {
  return flatMapDepth(functions, normalizeSelector, 2);
}

/**
 * `Operator` is a collection of `UnaryFunction`s that will be invoked in sequence
 * whenever a value is evaluated.
 */
export class Operator<TArg, TRes> extends Callable<[TArg], TRes> {
  /** The functions that are invoked when this `Operator` is called. */
  readonly functions: ReadonlyArray<UnaryFunction>;

  /**
   * Constructs an `Operator` from multiple `UnaryFunction`s or other `Operator`s.
   *
   * @param functions The mixed type arguments.
   */
  constructor(...functions: Many<OperatorOrFunction>[]) {
    let norm: UnaryFunction[];

    // Oddly istanbul thinks there is a branch here!
    // It is likely due to Typescript's transplilation.
    super(getImplSelector(norm = normalize(functions))) /* istanbul ignore next */;
    this.functions = norm;
  }

  /**
   * Evaluates all of this `Operator`'s functions passing the result of each to the next one.
   *
   * @param value The initial value for the first function.
   * @returns The result from the last function.
   * @throws Any errors thrown in any of the functions.
   */
  get(value: TArg): TRes {
    return this(value);
  }

  // tslint:disable:max-line-length
  pipe(): this;
  pipe<T1>(op: OperatorOrFunction<TRes, T1>): Operator<TArg, T1>;
  pipe<T1, T2>(op1: OperatorOrFunction<TRes, T1>, op2: OperatorOrFunction<T1, T2>): Operator<TArg, T2>;
  pipe<T1, T2, T3>(op1: OperatorOrFunction<TRes, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>): Operator<TArg, T3>;
  pipe<T1, T2, T3, T4>(op1: OperatorOrFunction<TRes, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>): Operator<TArg, T4>;
  pipe<T1, T2, T3, T4, T5>(op1: OperatorOrFunction<TRes, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>): Operator<TArg, T5>;
  pipe<T1, T2, T3, T4, T5, T6>(op1: OperatorOrFunction<TRes, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>, op6: OperatorOrFunction<T5, T6>): Operator<TArg, T6>;
  pipe<T1, T2, T3, T4, T5, T6, T7>(op1: OperatorOrFunction<TRes, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>, op6: OperatorOrFunction<T5, T6>, op7: OperatorOrFunction<T6, T7>): Operator<TArg, T7>;
  pipe<T1, T2, T3, T4, T5, T6, T7, T8>(op1: OperatorOrFunction<TRes, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>, op6: OperatorOrFunction<T5, T6>, op7: OperatorOrFunction<T6, T7>, op8: OperatorOrFunction<T7, T8>): Operator<TArg, T8>;
  pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(op1: OperatorOrFunction<TRes, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>, op6: OperatorOrFunction<T5, T6>, op7: OperatorOrFunction<T6, T7>, op8: OperatorOrFunction<T7, T8>, op9: OperatorOrFunction<T8, T9>): Operator<TArg, T9>;
  pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9>(op1: OperatorOrFunction<TRes, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>, op6: OperatorOrFunction<T5, T6>, op7: OperatorOrFunction<T6, T7>, op8: OperatorOrFunction<T7, T8>, op9: OperatorOrFunction<T8, T9>, ...ops: OperatorOrFunction[]): Operator<TArg, unknown>;
  // tslint:enable:max-line-length

  /**
   * Creates a new `Operator` with the passed `OperatorOrFunction`s added to the existing functions array.
   *
   * @param ops The `OperatorOrFunction`s to add.
   * @returns The new `Operator` instance.
   */
  pipe(...ops: OperatorOrFunction[]): Operator<TArg, any> {
    if (ops.length === 0) {
      return this;
    }

    const norm = normalize(ops);
    if (norm.length === 0) {
      return this;
    }

    return this.lift<TArg, any>([...this.functions, ...norm]);
  }

  /**
   * Creates a new `Operator` subclass instance.
   *
   * @param functions The functions for the new `Operator`.
   * @returns A new `Operator` instance with the same class as `this`.
   */
  lift<TArg1, TRes1>(functions: UnaryFunction[]): Operator<TArg1, TRes1> {
    return new Operator(functions);
  }

  /**
   * Returns this.
   *
   * @deprecated Call operator directly.
   */
  /* istanbul ignore next */
  get getter(): UnaryFunction<TArg, TRes> {
    return this;
  }

  /**
   * Equals operator.
   *
   * @deprecated Support for comparing `Operator`s will be dropped in the future.
   * @param other Another value.
   * @returns True if other === this.
   */
  /* istanbul ignore next */
  equals(other: any): boolean {
    return this === other;
  }

  /**
   * Hashs code.
   *
   * @deprecated Support for hash code will be dropped in the future.
   * @returns The hash code.
   */
  /* istanbul ignore next */
  hashCode(): number {
    return 0;
  }
}

/**
 * Determines whether an object is an `Operator`
 *
 * @param obj The object to test.
 * @returns True if the object is an `Operator`, false otherwise.
 */
export function isOperator<TArg, TRes>(obj: any): obj is Operator<TArg, TRes> {
  return obj && obj instanceof Operator;
}
