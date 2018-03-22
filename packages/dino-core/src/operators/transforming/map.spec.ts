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

  it('should be equal if same mapper', () => {
    const mapper = () => undefined;
    const op1 = new MapOperator(mapper);
    const op2 = new MapOperator(mapper);

    expect(op1.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different mappers', () => {
    const mapper1 = () => 1;
    const mapper2 = () => 2;

    const op1 = new MapOperator(mapper1);
    const op2 = new MapOperator(mapper2);

    expect(op1.equals(op2)).toBeFalsy();
  });
});
});
});
