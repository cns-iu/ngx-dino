/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />

import { AutoIdOperator } from './auto-id';

describe('operators', () => { // Prevent deep indentation
describe('generating', () => { // Prevent deep indentation
describe('AutoIdOperator', () => {
  it('should set a prefix', () => {
    const prefix = 'my_id_';
    const op = new AutoIdOperator(prefix);

    expect(op.prefix).toBe(prefix);
  });

  it('should return a different value on each get', () => {
    const op = new AutoIdOperator();
    const value1 = op.get(undefined);
    const value2 = op.get(undefined);

    expect(value1).not.toBe(value2);
  });

  it('should be equal to it self', () => {
    const op = new AutoIdOperator();

    expect(op.equals(op)).toBeTruthy();
  });

  it('should not be equal to other AutoIdOperator instances', () => {
    const op1 = new AutoIdOperator();
    const op2 = new AutoIdOperator();

    expect(op1.equals(op2)).toBeFalsy();
  });
});
});
});
