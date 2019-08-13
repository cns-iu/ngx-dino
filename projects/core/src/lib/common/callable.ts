/**
 * Additional options to the callable constructor.
 */
export interface CallableConstructorOpts {
  /** Indicates when the delegate function should be resolved. */
  resolve?: 'immediate' | 'once' | 'lazy';
}

/**
 * Type of a callable with type parameters.
 */
export interface Callable<TArgs extends any[], TRes> extends CallableFunction {
  (...args: TArgs): TRes;
}

/**
 * Constructor type for callable.
 */
export interface CallableConstructor {
  new <TArgs extends any[], TRes>(callback: (...args: TArgs) => TRes):
    Callable<TArgs, TRes>;
  new <TArgs extends any[], TRes>(property: PropertyKey, opts?: CallableConstructorOpts):
    Callable<TArgs, TRes>;
}

// Unpack Object methods
const { create, defineProperties, getPrototypeOf, setPrototypeOf } = Object;

/**
 * Creates a sensible name for a callable class instance.
 *
 * @param func The delegate function or the property key in which it is stored.
 * @param proto The prototype of the class.
 * @returns A name containing both the class and delegate names.
 */
function getName(func: PropertyKey | Function, proto: any): string {
  const funcName = typeof func === 'function' ?
    func.name || '[anonymous]' : String(func) || `['']`;
  const className = proto.constructor.name;
  const name = `<instance of ${className}>.${funcName}`;
  return name;
}

/**
 * Looks up the delegate function stored in a property.
 *
 * @param instance The object to look up the function on.
 * @param proto The prototype of the class.
 * @param property The key on which the delegate is stored.
 * @returns The delegate function.
 * @throws {TypeError} If the value stored is not a function.
 */
function getFunction<TArgs extends any[], TRes>(
  instance: any, proto: any, property: PropertyKey
): (...args: TArgs) => TRes {
  const func: (...args: TArgs) => TRes = instance[property];
  if (typeof func !== 'function') {
    const funcName = String(property) || `['']`;
    const className = proto.constructor.name;
    const msg = `<instance of ${className}>.${funcName} is not a function`;
    throw new TypeError(msg);
  }

  return func;
}

/**
 * Creates a function that resolves the delegate according to the specified options.
 *
 * @param instance The callable instance on which delegates a looked up.
 * @param proto The prototype of the class.
 * @param property The key of the delegate or the delegate itself.
 * @param opts The options controlling when the delegate is resolved.
 * @returns The resolve function.
 */
function createResolver<TArgs extends any[], TRes>(
  instance: Callable<TArgs, TRes>, proto: any,
  property: PropertyKey | ((...args: TArgs) => TRes),
  opts: CallableConstructorOpts
): () => ((...args: TArgs) => TRes) {
  if (typeof property === 'function') {
    return () => property;
  } else if (opts.resolve === 'immediate') {
    const func = getFunction<TArgs, TRes>(proto, proto, property);
    return () => func;
  } else if (opts.resolve === 'once') {
    let func: (...args: TArgs) => TRes;
    return () => (func || (func = getFunction<TArgs, TRes>(instance, proto, property)));
  } else {
    return () => getFunction(instance, proto, property);
  }
}

/**
 * Creates a callable instance.
 *
 * @param proto The prototype of the class.
 * @param property The key of the delegate or the delegate itself.
 * @param opts The options controlling when the delegate is resolved.
 * @returns The callable instance.
 */
function createInstance<TArgs extends any[], TRes>(
  proto: any, property: PropertyKey | ((...args: TArgs) => TRes),
  opts: CallableConstructorOpts
): Callable<TArgs, TRes> {
  const resolve = createResolver(instance, proto, property, opts);
  function instance(...args: TArgs): TRes {
    return resolve().apply(instance, args);
  }

  setPrototypeOf(instance, proto);
  defineProperties(instance, {
    name: {
      configurable: true,
      enumerable: false,
      writable: false,
      value: getName(property, proto)
    },
    length: {
      configurable: true,
      enumerable: false,
      get: () => resolve().length
    }
  });

  return instance;
}

/**
 * Javascript style class for constructing callables.
 *
 * @param this The original new object. Used to determine the correct prototype.
 * @param property The delegate function or the property at which it is stored.
 * @param [opts] Options controlling when the delegate is loaded.
 * @returns A new callable instance.
 */
function _CallableConstructor<TArgs extends any[], TRes>(
  this: Callable<TArgs, TRes>, property: PropertyKey | ((...args: TArgs) => TRes),
  opts?: CallableConstructorOpts
): Callable<TArgs, TRes> {
  const proto = getPrototypeOf(this);
  const instance = createInstance(proto, property, opts || {});
  return instance;
}

// Set prototype
_CallableConstructor.prototype = create(Function.prototype);
_CallableConstructor.prototype.constructor = _CallableConstructor;

/**
 * Callable base class. Extend this to provide function style calls for your class.
 *
 * **Note**: Since the class instances are functions they also inherit all properties and methods of regular functions.
 * Therefore if `name` or `length` needs to be set use `Object.defineProperties`.
 */
export const Callable: CallableConstructor = _CallableConstructor as any;
