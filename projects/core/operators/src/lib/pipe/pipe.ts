import { Many } from 'lodash';

import { Operator, OperatorOrFunction } from '@ngx-dino/core';

// tslint:disable:max-line-length
export function pipe<TArgument = any, TResult = any>(): Operator<TArgument, TResult>;
export function pipe<T, R>(op: Many<OperatorOrFunction<T, R>>): Operator<T, R>;
export function pipe<T1, T2, R>(op1: Many<OperatorOrFunction<T1, T2>>, op2: Many<OperatorOrFunction<T2, R>>): Operator<T1, R>;
export function pipe<T1, T2, T3, R>(op1: Many<OperatorOrFunction<T1, T2>>, op2: Many<OperatorOrFunction<T2, T3>>, op3: Many<OperatorOrFunction<T3, R>>): Operator<T1, R>;
export function pipe<T1, T2, T3, T4, R>(op1: Many<OperatorOrFunction<T1, T2>>, op2: Many<OperatorOrFunction<T2, T3>>, op3: Many<OperatorOrFunction<T3, T4>>, op4: Many<OperatorOrFunction<T4, R>>): Operator<T1, R>;
export function pipe<T1, T2, T3, T4, T5, R>(op1: Many<OperatorOrFunction<T1, T2>>, op2: Many<OperatorOrFunction<T2, T3>>, op3: Many<OperatorOrFunction<T3, T4>>, op4: Many<OperatorOrFunction<T4, T5>>, op5: Many<OperatorOrFunction<T5, R>>): Operator<T1, R>;
export function pipe<T1, T2, T3, T4, T5, T6, R>(op1: Many<OperatorOrFunction<T1, T2>>, op2: Many<OperatorOrFunction<T2, T3>>, op3: Many<OperatorOrFunction<T3, T4>>, op4: Many<OperatorOrFunction<T4, T5>>, op5: Many<OperatorOrFunction<T5, T6>>, op6: Many<OperatorOrFunction<T6, R>>): Operator<T1, R>;
// tslint:enable:max-line-length

/**
 * Creates an `Operator` instance from `Operator`s and functions.
 *
 * @param [ops] The sub `Operator`s and functions.
 */
export function pipe<TArgument = any, TResult = any>(...ops: Many<OperatorOrFunction>[]): Operator<TArgument, TResult> {
  return new Operator(...ops);
}
