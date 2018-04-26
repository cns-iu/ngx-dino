import { Operator, create } from '../../test-util';
import { ConstantOperator } from './constant';


describe('operators', () => {
describe('classes', () => { // Prevent deep indentation
describe('generating', () => { // Prevent deep indentation
describe('ConstantOperator', () => {
  const value = 111;
  let op: Operator<any, any>;
  let rawOp: ConstantOperator<any>;

  beforeEach(() => {
    op = create(ConstantOperator, value);
    rawOp = op.wrapped as ConstantOperator<any>;
  });

  it('should create', () => {
    expect(op.wrapped).toEqual(jasmine.any(ConstantOperator));
  });

  it('should have a value', () => {
    expect(rawOp.value).toBe(value);
  });

  it('should always return the value', () => {
    const val1 = op.get(1);
    const val2 = op.get(2);
    expect(val1).toBe(value);
    expect(val2).toBe(value);
  });

  it('should be equal if equal values', () => {
    const op2 = create(ConstantOperator, value);
    expect(op.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different values', () => {
    const op2 = create(ConstantOperator, 765);
    expect(op.equals(op2)).toBeFalsy();
  });
});
});
});
});
