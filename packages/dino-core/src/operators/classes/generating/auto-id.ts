import { List } from 'immutable';

import { Flags, State, BaseOperator, BaseCache } from '../../base';


// Constants
const flags = Flags.combine(Flags.InputIndependent, Flags.SideEffectFree);


export class AutoIdOperator extends BaseOperator<any, string> {
  constructor(readonly prefix: string = '', private _counter: number = 0) {
    super(flags);
  }

  get counter(): number {
    return this._counter;
  }

  protected getImpl(data: any, cache: BaseCache): string {
    return `${this.prefix}${this._counter++}`;
  }

  protected getStateImpl(): State {
    return List.of(this.id);
  }
}
