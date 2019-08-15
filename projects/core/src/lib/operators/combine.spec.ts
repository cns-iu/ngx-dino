import { isOperator } from '../operator';
import { combine } from './combine';


describe('operators', () => {
describe('combine(op)', () => {
  it('returns the same Operator', () => {
    const arg = combine(1);
    const op = combine(arg);
    expect(op).toEqual(arg);
  });
});

describe('combine(spec)', () => {
  it('creates an Operator', () => {
    expect(isOperator(combine({}))).toBeTruthy();
  });

  it('replaces Operators with their results', () => {
    const op = combine({ a: combine(1) });
    expect(op({})).toEqual({ a: 1 });
  });

  it('copies other values', () => {
    const op = combine({ b: 2 });
    expect(op({})).toEqual({ b: 2 });
  });

  it('removes keys for which the Operator return undefined', () => {
    const op = combine({ c: combine(undefined) });
    expect(op({})).not.toContain('c');
  });
});
});
