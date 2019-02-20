import { Operator } from '@ngx-dino/core';

import { constant } from './constant';

describe('Operators', () => {
  describe('constant(value)', () => {
    const value = [5, 6, 7, 'eight'];
    const operator = constant(value);

    it('returns an Operator', () => {
      expect(operator).toEqual(jasmine.any(Operator));
    });

    describe('returned Operator', () => {
      it('returns the constant value', () => {
        expect(operator('anything')).toBe(value);
      });
    });
  });
});
