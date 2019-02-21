import { Operator } from '../operator/operator';


/**
 * Type of a `PropertyKey` and `Operator` pair.
 */
export type OperatorEntry<TArgument = any, TResult = any> = [PropertyKey, Operator<TArgument, TResult>];

/**
 * Type of an object containing `Operator`s.
 */
export type OperatorGroup<TArgument = any, TResult = any> = {
  [K in PropertyKey]: Operator<TArgument, TResult>;
};

/**
 * Type of a `Map` with `PropertyKey` keys and `Operator` values.
 */
export type OperatorMap<TArgument = any, TResult = any> = Map<PropertyKey, Operator<TArgument, TResult>>;
