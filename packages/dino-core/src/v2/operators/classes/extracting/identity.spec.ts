import { Operator, create } from '../../test-util';
import { IdentityOperator } from './identity';


describe('operators', () => {
describe('classes', () => { // Prevent deep indentation
describe('extracting', () => { // Prevent deep indentation
describe('IdentityOperator', () => {
  let op: Operator<any, any>;

  beforeEach(() => {
    op = create(IdentityOperator);
  });

  it('should create', () => {
    expect(op.wrapped).toEqual(jasmine.any(IdentityOperator));
  });

  it('should be return the same data', () => {
    const data = 'foo data';
    expect(op.get(data)).toBe(data);
  });

  it('should always be equal to all IdentityOperator instances', () => {
    const op2 = create(IdentityOperator);
    expect(op.equals(op2)).toBeTruthy();
  });
});
});
});
});
