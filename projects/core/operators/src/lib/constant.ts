import { Operator } from '@ngx-dino/core';

export function constant<TVal>(value: TVal): Operator<unknown, TVal> {
  return new Operator(() => value);
}
