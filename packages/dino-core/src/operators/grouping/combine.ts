import {
  Collection, List, Map, Record,
  fromJS
} from 'immutable';
import {
  isArray, isObject, isPlainObject,
  cloneDeepWith
} from 'lodash';

import { BaseOperator } from '../base-operator';


export type Path = List<string | number>;
export type Schema = object | any[];
export type CloneFactory = (obj: any, key?: number | string, owner?: any, path?: Path) => any;


// Schema utility
const validSchemaTypes: List<(obj: any) => boolean> = List.of(
  isArray, isPlainObject
);

function isSchema(obj: any): obj is Schema {
  return validSchemaTypes.some((test) => test(obj));
}

function isCachableSchema(schema: any): boolean {
  let cachable = true;
  cloneDeepWith(schema, (value: any) => {
    if (value instanceof BaseOperator) {
      cachable = cachable && value.cachable;
    }

    // As soon a cachable is false return null to shorted the cloning process
    if (!cachable) {
      return null;
    }
  });

  return cachable;
}


// Cycle utility
class CycleRef extends Record({path: List()}) {
  constructor(path: Path) {
    super({path});
  }
}

function cloneDeepReplaceCycles(obj: any): any {
  const pathMemo = Map<any, Path>().asMutable();
  const cycleMemo = Map<any, CycleRef>().asMutable();

  return cloneDeepWith(obj, (value: any, key: number | string, owner: any) => {
    if (!isObject(value)) {
      return;
    }

    if (cycleMemo.has(value)) {
      return cycleMemo.get(value);
    }

    const path = pathMemo.get(owner, List()).push(key || '');
    pathMemo.set(value, path);
    cycleMemo.set(value, new CycleRef(path));
  });
}


// Operator manipulation
function cloneDeepUnwrapOperator(obj: any): any {
  return cloneDeepWith(obj, (value: any) => {
    if (value instanceof BaseOperator) {
      return value.unwrap();
    }
  });
}

function cloneDeepEvaluate<In, Out>(obj: any, data: In): Out {
  const removed = Map<any, List<any>>().asMutable();
  const result = cloneDeepWith(obj, (value: any, key: any, item: any, stack: any) => {
    if (!(value instanceof BaseOperator)) {
      return;
    }

    const replacement = value.get(data);
    if (replacement !== undefined) {
      return replacement;
    }

    removed.update(stack.get(item), (keys = List()) => keys.push(key));
  });

  removed.forEach((keys, item) => {
    if (item.delete !== undefined) { // Map or Set
      keys.forEach((key) => item.delete(key));
    } else { // Object or Array
      keys.forEach((key) => (delete item[key]));
    }
  });

  return result;
}


export class CombineOperator<In, Out> extends BaseOperator<In, Out> {
  readonly schema: Schema;

  constructor(schema: Schema) {
    super(isCachableSchema(schema));

    if (!isSchema(schema)) {
      throw Error('Invalid schema type');
    }

    this.schema = cloneDeepUnwrapOperator(schema);
  }

  protected getImpl(data: In): Out {
    return cloneDeepEvaluate(this.schema, data);
  }

  protected getStateImpl(): Collection<any, any> {
    return fromJS(cloneDeepReplaceCycles(this.schema));
  }
}
