import { Operator, create } from '../../test-util';
import { ConstantOperator } from './constant';


describe('operators', () => {
describe('classes', () => { // Prevent deep indentation
describe('extracting', () => { // Prevent deep indentation
describe('ConstantOperator', () => {
  const constant = 111;
  let op: Operator<any, any>;
  let rawOp: ConstantOperator<any>;

  beforeEach(() => {
    op = create(ConstantOperator, constant);
    rawOp = op.wrapped as ConstantOperator<any>;
  });

  it('should create', () => {
    expect(op.wrapped).toEqual(jasmine.any(ConstantOperator));
  });

  it('should have a constant', () => {
    expect(rawOp.constant).toBe(constant);
  });

  it('should always return the constant', () => {
    const val1 = op.get(1);
    const val2 = op.get(2);
    expect(val1).toBe(constant);
    expect(val2).toBe(constant);
  });

  it('should be equal if equal constants', () => {
    const op2 = create(ConstantOperator, constant);
    expect(op.equals(op2)).toBeTruthy();
  });

  it('should not be equal if different constants', () => {
    const op2 = create(ConstantOperator, 765);
    expect(op.equals(op2)).toBeFalsy();
  });
});
});
});
});
