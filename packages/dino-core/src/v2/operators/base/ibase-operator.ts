import { Collection } from 'immutable';

import { OperatorFlags } from './operator-flags';


export interface IBaseOperator<In, Out> {
  readonly id: string;
  readonly flags: OperatorFlags;

  get(data: In, cache: ICache): Out;
  getState(): Collection<any, any>;

  equals(other: any): boolean;
  hashCode(): number;
}


export interface ICache {
  enter(): void;
  exit(): void;

  get<In, Out>(op: IBaseOperator<In, Out>, data: In): Out;
  clear(): void;
}
