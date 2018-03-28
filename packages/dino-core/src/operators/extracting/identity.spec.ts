/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />

import { IdentityOperator } from './identity';

describe('operators', () => { // Prevent deep indentation
describe('extracting', () => { // Prevent deep indentation
describe('IdentityOperator', () => {
  it('should be return the same data', () => {
    const data = 'foo data';
    const op = new IdentityOperator();

    expect(op.get(data)).toBe(data);
  });

  it('should always be equal to all IdentityOperator instances', () => {
    const op1 = new IdentityOperator();
    const op2 = new IdentityOperator();

    expect(op1.equals(op1)).toBeTruthy();
    expect(op1.equals(op2)).toBeTruthy();
  });
});
});
});
