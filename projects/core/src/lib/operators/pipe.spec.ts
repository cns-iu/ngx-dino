import { isOperator } from '../operator';
import { pipe } from './pipe';

function empty() {}

describe('operators', () => {
describe('pipe(op1, op2, ...)', () => {
  it('returns an Operator', () => {
    expect(isOperator(pipe())).toBeTruthy();
  });

  it('has the specified functions', () => {
    const op = pipe(empty);
    expect(op.functions).toEqual([empty]);
  });
});
});
