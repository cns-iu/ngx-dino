import {
  Collection, List, Map, Record,
  fromJS
} from 'immutable';
import {
  isArray, isObject, isPlainObject,
  cloneDeepWith
} from 'lodash';

import { BaseOperator } from './base-operator';


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


// Operator replacement
function cloneDeepUnwrapOperator(obj: any): any {
  return cloneDeepWith(obj, (value: any) => {
    if (value instanceof BaseOperator) {
      return value.unwrap();
    }
  });
}

function cloneDeepEvaluate<In, Out>(obj: any, data: In): Out {
  return cloneDeepWith(obj, (value: any, ...args) => {
    if (value instanceof BaseOperator) {
      return value.get(data);
    }
  });
}


export class CombineOperator<In, Out> extends BaseOperator<In, Out> {
  readonly schema: Schema;

  constructor(schema: Schema) {
    super(true);

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
