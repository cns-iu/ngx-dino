import { Operator, create } from '../../test-util';
import { AccessorOperator } from './accessor';


describe('operators', () => {
describe('classes', () => { // Prevent deep indentation
describe('extracting', () => { // Prevent deep indentation
describe('AccessorOperator', () => {
  const path = 'the.path';
  const defaultValue = 'a_default_value';
  let op: Operator<any, any>;
  let rawOp: AccessorOperator<any>;

  beforeEach(() => {
    op = create(AccessorOperator, path, defaultValue);
    rawOp = op.wrapped as AccessorOperator<any>;
  });

  it('should create', () => {
    expect(op.wrapped).toEqual(jasmine.any(AccessorOperator));
  });

  it('should have a path', () => {
    expect(rawOp.path).toBe(path);
  });

  it('should have a default value', () => {
    expect(rawOp.defaultValue).toBe(defaultValue);
  });

  it('should extract the value', () => {
    const obj = {the: {path: 1}};
    expect(op.get(obj)).toBe(1);
  });

  it('should return the default if no value', () => {
    const obj = {};
    expect(op.get(obj)).toBe(defaultValue);
  });

  it('should be equal if same path and default value', () => {
    const op2 = create(AccessorOperator, path, defaultValue);
    expect(op.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different paths', () => {
    const op2 = create(AccessorOperator, 'a.different.path', defaultValue);
    expect(op.equals(op2)).toBeFalsy();
  });

  it('should not be equal if different default values', () => {
    const op2 = create(AccessorOperator, path, 'a_changed_default_value');
    expect(op.equals(op2)).toBeFalsy();
  });
});
});
});
});
