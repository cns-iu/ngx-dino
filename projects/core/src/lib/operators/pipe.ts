import { Operator, OperatorOrFunction } from '../operator';

// tslint:disable:max-line-length
export function pipe<T0, T1>(op?: OperatorOrFunction<T0, T1>): Operator<T0, T1>;
export function pipe<T0, T1, T2>(op1: OperatorOrFunction<T0, T1>, op2: OperatorOrFunction<T1, T2>): Operator<T0, T2>;
export function pipe<T0, T1, T2, T3>(op1: OperatorOrFunction<T0, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>): Operator<T0, T3>;
export function pipe<T0, T1, T2, T3, T4>(op1: OperatorOrFunction<T0, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>): Operator<T0, T4>;
export function pipe<T0, T1, T2, T3, T4, T5>(op1: OperatorOrFunction<T0, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>): Operator<T0, T5>;
export function pipe<T0, T1, T2, T3, T4, T5, T6>(op1: OperatorOrFunction<T0, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>, op6: OperatorOrFunction<T5, T6>): Operator<T0, T6>;
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7>(op1: OperatorOrFunction<T0, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>, op6: OperatorOrFunction<T5, T6>, op7: OperatorOrFunction<T6, T7>): Operator<T0, T7>;
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8>(op1: OperatorOrFunction<T0, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>, op6: OperatorOrFunction<T5, T6>, op7: OperatorOrFunction<T6, T7>, op8: OperatorOrFunction<T7, T8>): Operator<T0, T8>;
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(op1: OperatorOrFunction<T0, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>, op6: OperatorOrFunction<T5, T6>, op7: OperatorOrFunction<T6, T7>, op8: OperatorOrFunction<T7, T8>, op9: OperatorOrFunction<T8, T9>): Operator<T0, T9>;
export function pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8, T9>(op1: OperatorOrFunction<T0, T1>, op2: OperatorOrFunction<T1, T2>, op3: OperatorOrFunction<T2, T3>, op4: OperatorOrFunction<T3, T4>, op5: OperatorOrFunction<T4, T5>, op6: OperatorOrFunction<T5, T6>, op7: OperatorOrFunction<T6, T7>, op8: OperatorOrFunction<T7, T8>, op9: OperatorOrFunction<T8, T9>, ...ops: OperatorOrFunction[]): Operator<T0, unknown>;
// tslint:enable:max-line-length

/**
 * Standalone pipe function.
 *
 * @param ops The `OperatorOrFunction`s to combine.
 * @returns A new `Operator` instance.
 */
export function pipe(...ops: OperatorOrFunction[]): Operator<unknown, unknown> {
  return new Operator(ops);
}
