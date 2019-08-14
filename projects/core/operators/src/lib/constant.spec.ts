import { isOperator } from '@ngx-dino/core';

import { constant } from './constant';

describe('operators', () => {
describe('constant(value)', () => {
  it('creates an Operator', () => {
    expect(isOperator(constant(1))).toBeTruthy();
  });

  it('returns the constant value on each call', () => {
    const op = constant(1);
    expect(op('unused')).toEqual(1);
  });
});
});
