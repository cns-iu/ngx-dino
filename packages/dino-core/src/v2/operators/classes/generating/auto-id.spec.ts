import { Operator, create } from '../../test-util';
import { AutoIdOperator } from './auto-id';


describe('operators', () => {
describe('classes', () => { // Prevent deep indentation
describe('extracting', () => { // Prevent deep indentation
describe('AutoIdOperator', () => {
  const prefix = 'abc_';
  const start = 22;
  let op: Operator<any, any>;
  let rawOp: AutoIdOperator;

  beforeEach(() => {
    op = create(AutoIdOperator, prefix, start);
    rawOp = op.wrapped as AutoIdOperator;
  });

  it('should create', () => {
    expect(op.wrapped).toEqual(jasmine.any(AutoIdOperator));
  });

  it('should have a prefix', () => {
    expect(rawOp.prefix).toBe(prefix);
  });

  it('should have a counter', () => {
    expect(rawOp.counter).toBe(start);
  });

  it('should produce different value on each get', () => {
    const val1 = op.get(0);
    const val2 = op.get(0);
    expect(val1).not.toEqual(val2);
  });

  it('should be equal to it self', () => {
    expect(op.equals(op)).toBeTruthy();
  });

  it('should not be equal to any other operators', () => {
    const op2 = create(AutoIdOperator, prefix, start);
    expect(op.equals(op2)).toBeFalsy();
  });
});
});
});
});
