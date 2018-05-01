import { Seq, List, Map, is } from 'immutable';
import {
  PropertyPath,
  isFunction,
  toPath, get as getProperty
} from 'lodash';

import { State, ImmutableValue } from './immutable-value';


export interface KeyFun<T> {
  keyOf(value: T): any;
}

// Common KeyFun wrappers
class PropertyKeyFun<T> extends ImmutableValue implements KeyFun<T> {
  constructor(readonly path: PropertyPath) {
    super();
  }

  keyOf(value: T): any {
    return getProperty(value, this.path);
  }

  getState(): State {
    return List.of(toPath(this.path));
  }
}

class FunKeyFun<T> extends ImmutableValue implements KeyFun<T> {
  constructor(readonly fun: (value: T) => any) {
    super();
  }

  keyOf(value: T): any {
    return this.fun(value);
  }

  getState(): State {
    return List.of(this.fun);
  }
}


// Utility
function normalizeKeyFun<T>(
  keyFun: PropertyPath | ((value: T) => any) | KeyFun<T>
): KeyFun<T> {
  if (keyFun['keyOf'] && isFunction(keyFun['keyOf'])) {
    return keyFun as KeyFun<T>;
  } else if (isFunction(keyFun)) {
    return new FunKeyFun(keyFun);
  } else {
    return new PropertyKeyFun(keyFun as PropertyPath);
  }
}


export class Cache<T> extends ImmutableValue {
  readonly keyFun: KeyFun<T>;
  readonly size: number;

  constructor(
    keyFun: PropertyPath | ((value: T) => any) | KeyFun<T>,
    readonly mapping: Map<any, T> = Map()
  ) {
    super();

    this.keyFun = normalizeKeyFun(keyFun);
    this.size = mapping.size;
  }


  // Value access
  values(): T[] {
    return this.valueSeq().toArray();
  }

  valueSeq(): Seq.Indexed<T> {
    return this.mapping.valueSeq();
  }


  // KeyFun change
  setKeyFun(keyFun: PropertyPath | ((value: T) => any) | KeyFun<T>): Cache<T> {
    if (is(this.keyFun, keyFun)) {
      return this;
    }

    const normKeyFun = normalizeKeyFun(keyFun);
    const newMapping = Map<any, T>(this.mapping.valueSeq().map((value) => {
      return [normKeyFun.keyOf(value), value];
    }));

    return new Cache(normKeyFun, newMapping);
  }


  // Cache mutations
  add(value: T): Cache<T> {
    return this.addMany([value]);
  }

  addMany(values: T[]): Cache<T> {
    return this.mutate(values, (mapping, key, value) => {
      mapping.update(key, (val = value) => val);
    });
  }

  remove(value: T): Cache<T> {
    return this.removeMany([value]);
  }

  removeMany(values: T[]): Cache<T> {
    return this.mutate(values, (mapping, key) => mapping.delete(key));
  }

  update(value: T): Cache<T> {
    return this.updateMany([value]);
  }

  updateMany(values: T[]): Cache<T> {
    return this.mutate(values, (mapping, key, value) => {
      mapping.update(key, () => value);
    });
  }


  // ImmutableValue interface implementation
  protected getState(): State {
    return List.of<any>(this.keyFun, this.mapping);
  }


  // Utility
  private mutate(
    values: T[],
    cb: (mapping: Map<any, T>, key: any, value: T) => void
  ): Cache<T> {
    if (values.length === 0) {
      return this;
    }

    const newMapping = this.mapping.withMutations((mapping) => {
      values.forEach((value) => {
        const key = this.keyFun.keyOf(value);
        cb(mapping, key, value);
      });
    });

    return this.mapping === newMapping ? this : new Cache(this.keyFun, newMapping);
  }
}
