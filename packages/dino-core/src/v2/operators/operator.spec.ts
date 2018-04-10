/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />

import { MockOperator } from './test-util/mock-operator';
import { BaseOperator } from './base/base';
import { Operator } from './operator';


describe('operators', () => {
describe('Operator', () => {
  let mock: MockOperator;
  let op: Operator<any, any>;

  beforeEach(() => {
    mock = new MockOperator();
    op = new Operator(mock);
  }, jasmine.DEFAULT_TIMEOUT_INTERVAL);

  it('should create', () => {
    expect(op).toEqual(jasmine.any(Operator));
  });

  it('should have a wrapped operator', () => {
    expect(op.wrapped).toBe(mock);
  });
  // TODO
});
});
