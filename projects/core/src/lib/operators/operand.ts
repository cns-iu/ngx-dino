import { Operator } from './operator';

export function Operand<T = any>(operator: Operator<any, T>, cached = true) {
  return function (target: any, key: string) {
    if (delete target[key]) {
      let getter = function() { return operator.get(this); };

      if (cached) {
        const cacheKey = `__MEMOIZED_${key}__`;
        getter = function() {
          if (this.hasOwnProperty(cacheKey)) {
            return this[cacheKey];
          } else {
            const result = operator.get(this);
            Object.defineProperty(this, cacheKey, {
              configurable: false,
              enumerable: false,
              writable: false,
              value: result
            });
            return result;
          }
        };
      }

      Object.defineProperty(target, key, {
        get: getter,
        enumerable: true,
        configurable: true
      });
    }
  };
}
