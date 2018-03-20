import { Map, Set } from 'immutable';
import { isFunction, isUndefined, defaultsDeep } from 'lodash';

import { Operator } from './operator';

export type CommonKeys<R1, R2> = keyof R1 & keyof R2;
export type OperatorMap<R1, R2 extends any, K extends string = keyof R2> =
  Map<K, Operator<R1, R2[K]>>;
export type OperatorObject<R1, R2 extends any, K extends string = keyof R2> =
  Partial<{[P in K]: Operator<R1, R2[P]>}>;

export type CopyArg<In, Out> = Iterable<CommonKeys<In, Out>>;
export type ExtractArg<In, Out extends any> = OperatorObject<In, Out>;
export type ComputeArg<In, Out extends any> = OperatorObject<Partial<Out>, Out>;

function valueOr<T>(value: T, defaultValue: T): T {
  return !isUndefined(value) ? value : defaultValue;
}


export class Processor<InRecord, OutRecord> {
  readonly copiedProperties: Set<CommonKeys<InRecord, OutRecord>>;
  readonly extractedProperties: OperatorMap<InRecord, OutRecord>;
  readonly computedProperties: OperatorMap<InRecord, OutRecord>;

  private readonly extractOperator: Operator<InRecord, Partial<OutRecord>>;
  private readonly computeOperator: Operator<Partial<OutRecord>, Partial<OutRecord>>;

  constructor(
    copied?: CopyArg<InRecord, OutRecord>,
    extracted?: ExtractArg<InRecord, OutRecord>,
    computed?: ComputeArg<InRecord, OutRecord>,
    readonly factory?: () => OutRecord
  ) {
    this.copiedProperties = Set(valueOr(copied, []));
    this.extractedProperties = Map(valueOr(extracted, {})) as any;
    this.computedProperties = Map(valueOr(computed, {})) as any;

    this.extractOperator = Operator.identity()
      .combine(this.extractedProperties.toObject());
    this.computeOperator = Operator.identity()
      .combine(this.computedProperties.toObject());

    this.factory = isFunction(factory) ? factory : () => ({} as OutRecord);
  }

  process(data: InRecord): OutRecord {
    const result = this.factory();

    this.copiedProperties.forEach((key) => {
      result[key] = data[key] as any;
    });

    const extracted = this.extractOperator.get(data);
    defaultsDeep(result, extracted);

    const computed = this.computeOperator.get(result);
    defaultsDeep(result, computed);

    return result;
  }
}
