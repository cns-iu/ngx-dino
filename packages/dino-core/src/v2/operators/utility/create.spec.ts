import { Operator, MockOperator } from '../test-util';
import { create } from './create';


describe('operators', () => {
describe('utility', () => {
describe('create', () => {
  it('should return a new Operator', () => {
    const op = create(MockOperator);

    expect(op).toEqual(jasmine.any(Operator));
    expect(op.wrapped).toEqual(jasmine.any(MockOperator));
  });
});
});
});
