
/**
 * Objects implementing this interface are callable using function syntax.
 *
 * @template Arguments The types of the function's arguments.
 * @template Result The type of the function's return value.
 */
export interface CallableInstance<Arguments extends any[], Result> extends CallableFunction {
  (...args: Arguments): Result; // tslint:disable-line:callable-types
}

/**
 * Interface for constructors returning `CallableInstance`s.
 */
export interface CallableConstructor {
  new <Arguments extends any[], Result>(property: PropertyKey): CallableInstance<Arguments, Result>;
}

// Unpack Object methods
const { create, defineProperties, getPrototypeOf, setPrototypeOf } = Object;

/**
 * Gets and asserts that the value at `self[property]` exists and is a function.
 *
 * @param self The `this` object.
 * @param proto Prototype for the class.
 * @param property Property key of the function.
 * @returns The function.
 */
function getFunctionFor(self: Function, proto: any, property: PropertyKey): Function {
  const func: any = self[property];

  if (typeof func !== 'function') {
    throw new TypeError(`this[${String(property)}] of class ${proto.constructor.name} is not a function`);
  }
  return func;
}

/**
 * Constructs a new callable instance.
 * NOTE: Assumes code is executed in strict mode. I.e. `this !== window`.
 *
 * @param property Property key of function that all calls will be delegated to.
 * @param [className] Optional class name for providing better error messages.
 * @returns The new callable instance.
 */
function _CallableConstructor(property: PropertyKey): any {
  const proto: any = getPrototypeOf(this);
  const instance = function (...args: any[]): any {
    const func = getFunctionFor(instance, proto, property);
    return func.apply(instance, args);
  };

  defineProperties(instance, {
    name: {
      configurable: true,
      enumerable: false,
      writable: false,
      value: `${proto.constructor.name}#${String(property)}`
    },
    length: {
      configurable: true,
      enumerable: false,
      get: () => getFunctionFor(instance, proto, property).length
    }
  });
  setPrototypeOf(instance, proto);
  return instance;
}

// Set prototype
_CallableConstructor.prototype = create(Function.prototype);

/**
 * Callable base class. Extend this to provide function style calls for your class.
 *
 * `super` must be called with the property key of the function to which all calls will be delegated.
 * `super` also accepts an optional second argument containing the class name for generating better error messages.
 *
 * Note: Since the class instances are functions they also have all properties and methods that functions have.
 * Therefore if `name` or `length` needs to be set use `Object.defineProperties`.
 *
 * @template Arguments The types of the function's arguments.
 * @template Result The type of the function's return value.
 */
export const Callable: CallableConstructor = _CallableConstructor as any;
