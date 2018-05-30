import { BaseOperator, Operator, MockOperator } from '../test-util';
import { createRaw, create } from './create';


describe('operators', () => {
describe('utility', () => {
describe('createRaw', () => {
  let rawOp: BaseOperator<any, any>;

  beforeEach(() => {
    rawOp = createRaw(MockOperator);
  });

  it('should return a new operator of the specified type', () => {
    expect(rawOp).toEqual(jasmine.any(MockOperator));
  });
});

describe('create', () => {
  let op: Operator<any, any>;

  beforeEach(() => {
    op = create(MockOperator);
  });

  it('should return a new Operator', () => {
    expect(op).toEqual(jasmine.any(Operator));
  });

  it('should have a wrapped operator of the specified type', () => {
    expect(op.wrapped).toEqual(jasmine.any(MockOperator));
  });
});
});
});
