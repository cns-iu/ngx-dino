import { isOperator } from '../operator';
import { identity } from './identity';

describe('operators', () => {
describe('identity()', () => {
  it('creates an Operator', () => {
    expect(isOperator(identity())).toBeTruthy();
  });

  it('returns values unchanged', () => {
    const op = identity();
    expect(op(1)).toEqual(1);
  });
});
});
