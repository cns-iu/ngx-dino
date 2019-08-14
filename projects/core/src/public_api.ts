/*
 * Public API Surface of core
 */

export * from './lib/core.module';

export * from './lib/event';
export * from './lib/fields';
export * from './lib/processing';
export * from './lib/logging';
export * from './lib/directives';

export { Operator, OperatorOrFunction, UnaryFunction, isOperator } from './lib/operator/operator';
