import { Operator } from '../operator/operator';


/**
 * Type of a string and `Operator` pair.
 */
export type OperatorEntry<TArgument = any, TResult = any> = [string, Operator<TArgument, TResult>];

/**
 * Type of an object containing `Operator`s.
 */
export interface OperatorGroup<TArgument = any, TResult = any> {
  [key: string]: Operator<TArgument, TResult>;
}

/**
 * Type of a `Map` with string keys and `Operator` values.
 */
export type OperatorMap<TArgument = any, TResult = any> = Map<string, Operator<TArgument, TResult>>;
