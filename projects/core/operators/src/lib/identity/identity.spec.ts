import { Operator } from '@ngx-dino/core';

import { identity } from './identity';

describe('Operators', () => {
  describe('identity()', () => {
    const operator = identity();

    it('returns an Operator', () => {
      expect(operator).toEqual(jasmine.any(Operator));
    });

    describe('returned Operator', () => {
      const value = 'wsx';
      const result = operator(value);

      it('returns the passed value unchanged', () => {
        expect(result).toEqual(value);
      });
    });
  });
});
