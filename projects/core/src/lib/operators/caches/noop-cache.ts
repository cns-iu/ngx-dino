import { BaseOperator, BaseCache } from '../base';


export class NoopCache extends BaseCache {
  enter(): void { }
  exit(): void { }

  get<In, Out>(op: BaseOperator<In, Out>, data: In): Out {
    return op.get(data, this);
  }

  clear(): void { }
}
