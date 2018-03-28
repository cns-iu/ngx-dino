/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />

import { MapOperator } from './map';

describe('operators', () => { // Prevent deep indentation
describe('transforming', () => { // Prevent deep indentation
describe('MapOperator', () => {
  it('should set a mapper', () => {
    const mapper = (value) => value + 1;
    const op = new MapOperator(mapper);

    expect(op.mapper).toBe(mapper);
  });

  it('should set an args', () => {
    const mapper = () => undefined;
    const args = [1, 2, 7, 2, 1];
    const op = new MapOperator(mapper, ...args);

    expect(op.args).toBeDefined();
  });

  it('should call the mapper', () => {
    const mapper = jasmine.createSpy();
    const op = new MapOperator(mapper);

    op.get(undefined);
    expect(mapper.calls.any()).toBeTruthy();
  });

  it('should return what the mapper returns', () => {
    const value = 123;
    const mapper = () => value;
    const op = new MapOperator(mapper);

    expect(op.get(undefined)).toBe(value);
  });

  it('should send the arguments to the mapper', () => {
    const mapper = jasmine.createSpy();
    const data = 123;
    const args: any[] = ['a', 22, [1, 2]];
    const op = new MapOperator(mapper, ...args);

    op.get(data);
    expect(mapper).toHaveBeenCalledWith(...[data].concat(args));
  });

  it('should be equal if same mapper and arguments', () => {
    const mapper = () => undefined;
    const args = [{p: 'rr'}, 'tt', 2];
    const op1 = new MapOperator(mapper, ...args);
    const op2 = new MapOperator(mapper, ...args);

    expect(op1.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different mappers', () => {
    const mapper1 = () => 1;
    const mapper2 = () => 2;

    const op1 = new MapOperator(mapper1);
    const op2 = new MapOperator(mapper2);

    expect(op1.equals(op2)).toBeFalsy();
  });

  it('should not be equal if different arguments', () => {
    const mapper = () => 0;
    const args1 = [{}, 'b', 'c'];
    const args2 = ['d', [1], 9];
    const args3 = [{}, 'b', 'c']; // Different object than args1!

    const op1 = new MapOperator(mapper, ...args1);
    const op2 = new MapOperator(mapper, ...args2);
    const op3 = new MapOperator(mapper, ...args2);

    expect(op1.equals(op2)).toBeFalsy();
    expect(op1.equals(op3)).toBeFalsy();
  });
});
});
});
