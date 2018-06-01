import { BaseOperator, Operator, MockOperator, create } from '../test-util';
import { unwrap } from './unwrap';


describe('operators', () => {
describe('utility', () => {
describe('unwrap', () => {
  let op: Operator<any, any>;
  let rawOp: BaseOperator<any, any>;

  beforeEach(() => {
    op = create(MockOperator);
    rawOp = op.wrapped;
  });

  it('should unwrap Operators', () => {
    expect(unwrap(op)).not.toBe(op);
    expect(unwrap(op)).toBe(rawOp);
  });

  it('should not unwrap non-Operator BaseOperators', () => {
    expect(unwrap(rawOp)).toBe(rawOp);
  });
});
});
});
