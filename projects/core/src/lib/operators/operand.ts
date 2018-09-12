import { Operator } from './operator';

export function Operand<T = any>(operator: Operator<any, T>) {
  return function (target: any, key: string) {
    if (delete target[key]) {
      Object.defineProperty(target, key, {
        get: function() {
          return operator.get(this);
        },
        enumerable: true,
        configurable: true
      });
    }
  };
}
