import { isOperator } from '@ngx-dino/core';
import { combine } from './combine';


describe('operators', () => {
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
});
});
