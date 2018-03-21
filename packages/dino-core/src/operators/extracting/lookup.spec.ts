/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />

import { LookupOperator } from './lookup';

describe('operators', () => { // Prevent deep indentation
describe('extracting', () => { // Prevent deep indentation
describe('LookupOperator', () => {
  it('should have set a mapping', () => {
    const op = new LookupOperator({});

    expect(op.mapping).toBeDefined();
  });

  it('should have set a defaultValue', () => {
    const op = new LookupOperator({}, 11);

    expect(op.defaultValue).toBeDefined();
  });

  it('should lookup a value', () => {
    const mapping = {a: 1, b: 2, c: 3};
    const key = 'b';
    const op = new LookupOperator(mapping);

    expect(op.get(key)).toBe(2);
  });

  it('should return the defaultValue if lookup fails', () => {
    const mapping = {a: 1, b: 2, c: 3};
    const key = 'bad key';
    const defaultValue = 123;
    const op = new LookupOperator(mapping, defaultValue);

    expect(op.get(key)).toBe(defaultValue);
  });

  it('should be equal if equal mapping and defaultValue', () => {
    const mapping = {a: 1, b: 2, c: 3};
    const defaultValue = 123;

    const op1 = new LookupOperator(mapping, defaultValue);
    const op2 = new LookupOperator(mapping, defaultValue);

    expect(op1.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different mapping or defaultValue', () => {
    const mapping1 = {a: 1};
    const mapping2 = {b: 2};
    const defaultValue1 = 123;
    const defaultValue2 = 456;

    const op1 = new LookupOperator(mapping1, defaultValue1);
    const op2 = new LookupOperator(mapping1, defaultValue2);
    const op3 = new LookupOperator(mapping2, defaultValue1);
    const op4 = new LookupOperator(mapping2, defaultValue2);

    expect(op1.equals(op2)).toBeFalsy();
    expect(op1.equals(op3)).toBeFalsy();
    expect(op1.equals(op4)).toBeFalsy();
  });
});
});
});
