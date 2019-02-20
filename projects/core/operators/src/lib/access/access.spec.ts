import { Operator } from '@ngx-dino/core';
import { access } from './access';

describe('Operators', () => {
  const path = 'abc';
  const value = 1;
  const obj = { [path]: value };

  describe('access(path)', () => {
    const operator = access(path);

    it('returns an Operator', () => {
      expect(operator).toEqual(jasmine.any(Operator));
    });

    describe('returned Operator', () => {
      const result = operator(obj);

      it('returns the value at specified path', () => {
        expect(result).toEqual(value);
      });
    });
  });

  describe('access(path, defaultValue)', () => {
    const defaultValue = 11;
    const operator = access(path, defaultValue);

    describe('returned Operator', () => {
      it('returns the default value if the specified path does not exist', () => {
        expect(operator({ })).toEqual(defaultValue);
      });
    });
  });
});
