import { Operator } from './operator-class';

/**
 * Caches the value of a getter on the first access.
 *
 * @param getter The getter function.
 * @param key The property key on which the getter will be stored.
 * @returns A new getter that caches.
 */
function cachedGetter<TThis, TRes>(getter: (this: TThis) => TRes, key: string | symbol): (this: TThis) => TRes {
  return function() {
    const value = getter.call(this);
    Object.defineProperties(this, {
      [key]: {
        writable: true,
        value
      }
    });

    return value;
  };
}

export function Operand<TRes>(operator: Operator<unknown, TRes>, cached?: boolean): PropertyDecorator;
export function Operand<TArg, TRes>(operator: Operator<TArg, TRes>, cached?: boolean): PropertyDecorator;

/**
 * Decorator using an `Operator` to calculate the property value.
 *
 * @param operator The `Operator` used to calculate values.
 * @param cached Whether to cache the produced values.
 * @returns A property decorator.
 */
export function Operand<TArg, TRes>(operator: Operator<TArg, TRes>, cached = true): PropertyDecorator {
  function getter(this: TArg): TRes { return operator(this); }
  return (target, key) => {
    Object.defineProperties(target, {
      [key]: {
        configurable: true,
        enumerable: true,
        get: cached ? cachedGetter(getter, key) : getter
      }
    });
  };
}
