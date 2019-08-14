import { Operator, UnaryFunction } from '@ngx-dino/core';

export function map<TArg, TRes>(func: UnaryFunction<TArg, TRes>): Operator<TArg, TRes> {
  return new Operator(func);
}
