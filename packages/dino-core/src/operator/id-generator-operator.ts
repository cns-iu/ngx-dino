import { Collection, List } from 'immutable';

import { BaseOperator } from './base-operator';


export class IdGeneratorOperator extends BaseOperator<any, string> {
  constructor(readonly prefix: string = '', private counter: number = 0) {
    super(false);
  }

  protected getImpl(data: any): string {
    return this.prefix + this.counter++;
  }

  protected getStateImpl(): Collection<any, any> {
    return List.of(this.id);
  }
}
