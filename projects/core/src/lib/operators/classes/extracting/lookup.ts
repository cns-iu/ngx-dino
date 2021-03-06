import { List, Map } from 'immutable';

import { Flags, State, BaseOperator, BaseCache } from '../../base';


// Constants
const flags = Flags.combine(Flags.Stateless, Flags.SideEffectFree);


export class LookupOperator<In, Out> extends BaseOperator<In, Out> {
  readonly mapping: Map<In, Out>;

  // No good way to specialize the type of mapping to be fully compatible with
  // Immutable.Map's signature
  constructor(mapping: any, readonly defaultValue?: Out) {
    super(flags);

    this.mapping = Map(mapping);
  }

  protected getImpl(data: In, cache: BaseCache): Out {
    return this.mapping.get(data, this.defaultValue);
  }

  protected getStateImpl(): State {
    return List.of<any>(this.mapping, this.defaultValue);
  }
}
