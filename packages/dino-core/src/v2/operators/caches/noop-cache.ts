import { BaseOperator, BaseCache } from '../base/base';


export class NoopCache implements BaseCache {
  enter(): void { }
  exit(): void { }

  get<In, Out>(op: BaseOperator<In, Out>, data: In): Out {
    return op.get(data, this);
  }

  clear(): void { }
}
