import { IBaseOperator, ICache } from '../base/ibase-operator';


export class NoopCache implements ICache {
  static instance = new NoopCache();

  enter(): void { }
  exit(): void { }

  get<In, Out>(op: IBaseOperator<In, Out>, data: In): Out {
    return op.get(data, this);
  }

  clear(): void { }
}
