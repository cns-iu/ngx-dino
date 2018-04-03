/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />

import { MockOperator } from '../test-util/mock-operator';

import { NoopCache } from './noop-cache';


describe('operators', () => {
describe('caches', () => {
describe('NoopCache', () => {
  it('should create', () => {
    expect(new NoopCache()).toBe(jasmine.any(NoopCache));
  });

  it('should have an instance', () => {
    expect(NoopCache.instance).toBeDefined();
  });

  it('should call BaseOperator#get', () => {
    const op = new MockOperator();
    const spy = spyOn(op, 'get');

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
});
});
