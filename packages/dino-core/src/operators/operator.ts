import { Collection, Seq, is } from 'immutable';

import { sum as arraySum } from 'lodash';

import { BaseOperator } from './base-operator';

import { AutoIdOperator } from './generating/auto-id';
import { AccessorOperator, Path as AccessorPath } from './extracting/accessor';
import { ChainOperator } from './grouping/chain';
import { CombineOperator, Schema as CombineSchema } from './grouping/combine';
import { ConstantOperator } from './generating/constant';
import { IdentityOperator } from './extracting/identity';
import { LookupOperator, MappingArg as LookupMappingArg } from './extracting/lookup';
import { MapOperator } from './transforming/map';


export class Operator<In, Out> extends BaseOperator<In, Out> {
  constructor(private readonly wrapped: BaseOperator<In, Out>) {
    super(wrapped.cachable);

    if (wrapped instanceof Operator) {
      return wrapped; // Prevent wrapping a wrapper
    }
  }

  // Override base class methods
  protected getImpl(data: In): Out {
    return this.wrapped.get(data);
  }

  protected getStateImpl(): Collection<any, any> {
    return this.wrapped.getState();
  }

  unwrap(): BaseOperator<In, Out> {
    return this.wrapped;
  }


  // Convenience methods
  access<NewOut = any>(
    path: AccessorPath, defaultValue?: NewOut
  ): Operator<In, NewOut> {
    return this.chain(Operator.access(path, defaultValue));
  }

  chain<NewOut>(operator: Operator<Out, NewOut>): Operator<In, NewOut>;
  chain<NewOut = any>(first: Operator<Out, any>, ...operators: Operator<any, any>[]): Operator<In, NewOut>;
  chain<NewOut>(...operators: Operator<any, any>[]): Operator<In, NewOut> {
    return Operator.chain<In, NewOut>(this, ...operators);
  }

  combine<NewOut = any>(schema: object | any[]): Operator<In, NewOut> {
    return this.chain(Operator.combine(schema));
  }

  construct<T>(type: {new (args: Out): T}): Operator<In, T> {
    return this.map((args) => new type(args));
  }

  identity(): Operator<In, Out> {
    return this;
  }

  lookup<NewOut>(
    mapping: LookupMappingArg<Out, NewOut>, defaultValue?: NewOut
  ): Operator<In, NewOut> {
    return this.chain(Operator.lookup(mapping, defaultValue));
  }

  map<NewOut>(mapper: (data: Out) => NewOut): Operator<In, NewOut> {
    return this.chain(Operator.map(mapper));
  }

  sum(): Operator<In, number> {
    return this.map(arraySum);
  }
}


export namespace Operator {
  // Internal Utility
  interface OperatorConstructor<In, Out> {
    new (...args: any[]): BaseOperator<In, Out>;
  }

  function create<In, Out>(
    type: OperatorConstructor<In, Out>, ...args: any[]
  ): Operator<In, Out> {
    return new Operator(new type(...args));
  }

  // Static function on Operator class
  export function access<In = any, Out = any>(
    path: AccessorPath, defaultValue?: Out
  ): Operator<In, Out> {
    return create(AccessorOperator, path, defaultValue);
  }

  export function autoId(
    prefix?: string, start?: number
  ): Operator<any, string> {
    return create(AutoIdOperator, prefix, start);
  }

  export function chain<T = any>(): Operator<T, T>;
  export function chain<In, Out>(operator: Operator<In, Out>): Operator<In, Out>;
  export function chain<In = any, Out = any>(
    ...operators: Operator<any, any>[]
  ): Operator<In, Out>;
  export function chain(...operators: Operator<any, any>[]): Operator<any, any> {
    switch (operators.length) {
      case 0:
        return Operator.identity();

      case 1:
        return operators[0];

      default:
        return create(ChainOperator, ...operators);
    }
  }

  export function combine<In = any, Out = any>(
    schema: CombineSchema
  ): Operator<In, Out> {
    return create(CombineOperator, schema);
  }

  export function constant<T>(value: T): Operator<any, T> {
    return create(ConstantOperator, value);
  }

  export function construct<In, T>(type: {new (args: In): T}): Operator<In, T> {
    return Operator.map((args) => new type(args));
  }

  export function identity<T = any>(): Operator<T, T> {
    return create(IdentityOperator);
  }

  export function lookup<In, Out>(
    mapping: LookupMappingArg<In, Out>, defaultValue?: Out
  ): Operator<In, Out> {
    return create(LookupOperator, mapping, defaultValue);
  }

  export function map<In, Out>(mapper: (data: In) => Out): Operator<In, Out> {
    return create(MapOperator, mapper);
  }

  export function sum<In = any>(
    ...operators: (number | Operator<In, number>)[]
  ): Operator<In, Number> {
    switch (operators.length) {
      case 0:
        return Operator.constant(0);

      case 1:
        const op = operators[0];
        return op instanceof Operator ? op : Operator.constant(op);

      default:
        return Operator.combine(operators).map(arraySum);
    }
  }
}
