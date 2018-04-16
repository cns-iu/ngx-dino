/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />

import { List } from 'immutable';

import { MockOperator } from './test-util/mock-operator';

import { Flags } from './base/flags';
import { BaseOperator, BaseCache } from './base/base';
import { Operator } from './operator';


describe('operators', () => {
describe('Operator', () => {
  const mockValue = 1;
  const mockState = List.of(2);
  const mockFlags = Flags.All;

  let mock: MockOperator;
  let op: Operator<any, any>;

  beforeEach(() => {
    mock = new MockOperator(mockValue, mockState, mockFlags);
    op = new Operator(mock);
  }, jasmine.DEFAULT_TIMEOUT_INTERVAL);

  it('should create', () => {
    expect(op).toBeDefined();
  });

  it('should have a wrapped operator', () => {
    expect(op.wrapped).toBe(mock);
  });

  it('should have a getter', () => {
    expect(op.getter).toEqual(jasmine.any(Function));
  });

  it('should provide a default cache', () => {
    const spy = spyOn(mock, 'get');
    let cache: any;

    op.get(undefined);
    ({args: [, cache]} = spy.calls.mostRecent());
    expect(cache).toEqual(jasmine.any(BaseCache));
  });

  it('should have the same flags as the wrapped BaseOperator', () => {
    expect(op.flags).toEqual(mock.flags);
  });

  it('should have the same state as the wrapped BaseOperator', () => {
    expect(op.getState()).toEqual(mock.getState());
  });

  it('should call the wrapped BaseOperator#get', () => {
    const spy = spyOn(mock, 'get');

    op.get(undefined);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should return the result of the wrapped BaseOperator#get', () => {
    expect(op.get(undefined)).toEqual(mockValue);
  });

  it('should compare equal to the wrapped BaseOperator', () => {
    expect(op.equals(mock)).toBeTruthy();
  });

  it('should compare equal to another Operator with the same wrapped BaseOperator', () => {
    const op2 = new Operator(mock);

    expect(op.equals(op2)).toBeTruthy();
  });

  it('should compare equal to other BaseOperator that compare equal to the wrapped BaseOperator', () => {
    const mock2 = new MockOperator(mockValue, mockState, mockFlags);
    const op2 = new Operator(mock2);

    expect(op.equals(mock2)).toBeTruthy();
    expect(op.equals(op2)).toBeTruthy();
  });

  it('should not compare equal if the wrapped BaseOperators do not compare equal', () => {
    const mock2 = new MockOperator();
    const op2 = new Operator(mock2);

    expect(mock.equals(mock2)).toBeFalsy();
    expect(op.equals(op2)).toBeFalsy();
  });
});
});
