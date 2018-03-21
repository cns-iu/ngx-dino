/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />

import { AccessorOperator } from './accessor';

describe('operators', () => { // Prevent deep indentation
describe('extracting', () => { // Prevent deep indentation
describe('AccessorOperator', () => {
  it('should have set a path', () => {
    const path = 'path.to.value';
    const op = new AccessorOperator(path);

    expect(op.path).toBe(path);
  });

  it('should have set a defaultValue', () => {
    const defaultValue = 11;
    const op = new AccessorOperator('path', defaultValue);

    expect(op.defaultValue).toBe(defaultValue);
  });

  it('should extract the value (simple path)', () => {
    const path = 'a_path';
    const value = 'my value';
    const obj = {[path]: value};
    const op = new AccessorOperator(path);

    expect(op.get(obj)).toBe(value);
  });

  it('should extract the value (complex path)', () => {
    const path = ['a', 'b', 1];
    const value = 101;
    const obj = {a: {b: [undefined, value]}};
    const op = new AccessorOperator(path);

    expect(op.get(obj)).toBe(value);
  });

  it('should return defaultValue if no value (simple path)', () => {
    const path = 'qwerty';
    const defaultValue = [1, 2];
    const obj = {};
    const op = new AccessorOperator(path, defaultValue);

    expect(op.get(obj)).toBe(defaultValue);
  });

  it('should return defaultValue if no value (complex path)', () => {
    const path = ['q', 2, 'w'];
    const defaultValue = {a: 11};
    const obj = {q: [0, 0, 0]};
    const op = new AccessorOperator(path, defaultValue);

    expect(op.get(obj)).toBe(defaultValue);
  });

  it('should be equal if same path and defaultValue', () => {
    const path = 'a.b.c';
    const defaultValue = 1;

    const op1 = new AccessorOperator(path, defaultValue);
    const op2 = new AccessorOperator(path, defaultValue);

    expect(op1.equals(op2)).toBeTruthy();
  });

  it('should not be equal if difference path or defaultValue', () => {
    const path1 = 'a.b.c';
    const path2 = 'd.e.f';
    const defaultValue1 = 1;
    const defaultValue2 = 2;

    const op1 = new AccessorOperator(path1, defaultValue1);
    const op2 = new AccessorOperator(path1, defaultValue2);
    const op3 = new AccessorOperator(path2, defaultValue1);
    const op4 = new AccessorOperator(path2, defaultValue2);

    expect(op1.equals(op2)).toBeFalsy();
    expect(op1.equals(op3)).toBeFalsy();
    expect(op1.equals(op4)).toBeFalsy();
  });
});
});
});
