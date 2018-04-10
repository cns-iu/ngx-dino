/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />

import { MockOperator } from '../test-util/mock-operator';
import { NoopCache } from './noop-cache';


describe('operators', () => {
describe('caches', () => {
describe('NoopCache', () => {
  it('should create', () => {
    expect(new NoopCache()).toEqual(jasmine.any(NoopCache));
  });

  it('should call BaseOperator#get', () => {
    const op = new MockOperator();
    const cache = new NoopCache();
    const spy = spyOn(op, 'get');

    cache.get(op, undefined);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
});
});
