import { Collection, List, Map } from 'immutable';

import { BaseOperator } from '../base-operator';


export type MappingArg<K, V> = any; // FIXME correct typing

export class LookupOperator<In, Out> extends BaseOperator<In, Out> {
  readonly mapping: Map<In, Out>;

  constructor(mapping: MappingArg<In, Out>, readonly defaultValue?: Out) {
    super(true);

    this.mapping = Map(mapping);
  }

  protected getImpl(key: In): Out {
    return this.mapping.get(key, this.defaultValue);
  }

  protected getStateImpl(): Collection<any, any> {
    return List.of<any>(this.mapping, this.defaultValue);
  }
}
