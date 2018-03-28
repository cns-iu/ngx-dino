/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />

import { ConstantOperator } from './constant';

describe('operators', () => { // Prevent deep indentation
describe('generating', () => { // Prevent deep indentation
describe('ConstantOperator', () => {
  it('should set a value', () => {
    const value = 'abc';
    const op = new ConstantOperator(value);

    expect(op.value).toBe(value);
  });

  it('should always return the value', () => {
    const value = 12;
    const op = new ConstantOperator(value);

    expect(op.get(undefined)).toBe(value);
  });

  it('should be equal if same value', () => {
    const value = [1, 2];
    const op1 = new ConstantOperator(value);
    const op2 = new ConstantOperator(value);

    expect(op1.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different values', () => {
    const value1 = 1;
    const value2 = [0, 1, 2];
    const value3 = [0, 1, 2];

    const op1 = new ConstantOperator(value1);
    const op2 = new ConstantOperator(value2);
    const op3 = new ConstantOperator(value3);

    expect(op1.equals(op2)).toBeFalsy();
    expect(op1.equals(op3)).toBeFalsy();
    expect(op2.equals(op3)).toBeFalsy();
  });
});
});
});
