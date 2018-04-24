import { BaseOperator, BaseCache } from '../base/base';


// Callback function
// May modify it's args object to change the behavior of the TraceCache
export type TraceCallback = (args: TraceCallbackArgs) => void;
export interface TraceCallbackArgs {
  operator: BaseOperator<any, any>;
  cache: TraceCache;
  level: number;
  data: any;
  result?: any;
  error?: any;
}

interface OperatorResult {
  result?: any;
  error?: any;
}

interface TraceResult {
  error?: any;
}


// Error propagation
class PropagatingError {
  constructor(readonly error: any) { }

  rethrow(level: number): never {
    if (level === 0) {
      throw this.error;
    } else {
      throw this;
    }
  }
}


export class TraceCache extends BaseCache {
  private level = 0;

  constructor(readonly trace: TraceCallback) {
    super();
  }

  enter() {
    this.level += 1;
  }

  exit() {
    this.level -= 1;
  }

  get<In, Out>(op: BaseOperator<In, Out>, data: In): Out {
    const args: TraceCallbackArgs = {
      operator: op,
      cache: this,
      level: this.level,
      data: data,
      result: undefined,
      error: undefined
    };

    const opRes = this.callOperator(op, data);
    const traceRes = this.callTrace(args, opRes);
    return this.returnOrThrow(args, opRes, traceRes);
  }

  clear() { }

  private callOperator<In, Out>(op: BaseOperator<In, Out>, data: In): OperatorResult {
    try {
      return {result: op.get(data, this)};
    } catch (error) {
      if (error instanceof PropagatingError) {
        error.rethrow(this.level);
      }

      return {error};
    }
  }

  private callTrace(args: TraceCallbackArgs, opRes: OperatorResult): TraceResult {
    Object.assign(args, opRes);
    try {
      this.trace(args);
      return {};
    } catch (error) {
      return {error};
    }
  }

  private returnOrThrow(
    args: TraceCallbackArgs,
    opRes: OperatorResult,
    traceRes: TraceResult
  ): any {
    const { result, error: aerror } = args;
    const { error: oerror } = opRes;
    const { error: terror } = traceRes;
    let error: any = terror || aerror;

    if (error !== undefined) {
      if (error !== oerror && this.level !== 0) {
        error = new PropagatingError(error);
      }

      throw error;
    }

    return result;
  }
}
