import { Operator } from '@ngx-dino/core';

import { lookup } from './lookup';

describe('Operators', () => {
  describe('lookup(mapping)', () => {
    describe('when mapping is an object', () => {
      const key = 123;
      const value = 456;
      const mapping = { [key]: value };
      const operator = lookup(mapping);

      it('returns an Operator', () => {
        expect(operator).toEqual(jasmine.any(Operator));
      });

      describe('returned Operator', () => {
        it('return the value for the key', () => {
          expect(operator(key)).toEqual(value);
        });

        it('returns undefined if the key does not exist in the mapping', () => {
          expect(operator('bad')).toBeUndefined();
        });
      });
    });

    describe('when mapping is a Map or WeakMap', () => {
      const key = { };
      const value = 'def';
      const mapping = new Map([[key, value]]);
      const operator = lookup(mapping);

      it('returns an Operator', () => {
        expect(operator).toEqual(jasmine.any(Operator));
      });

      describe('returned Operator', () => {
        it('return the value for the key', () => {
          expect(operator(key)).toEqual(value);
        });

        it('returns undefined if the key does not exist in the mapping', () => {
          expect(operator('bad')).toBeUndefined();
        });
      });
    });
  });

  describe('lookup(mapping, defaultValue)', () => {
    describe('when mapping is an object', () => {
      const defaultValue = 700;
      const operator = lookup({ }, defaultValue);

      describe('returned Operator', () => {
        it('returns the default value if the key does not exist in the mapping', () => {
          expect(operator('qwerty')).toEqual(defaultValue);
        });
      });
    });

    describe('when mapping is a Map or WeakMap', () => {
      const defaultValue = 700;
      const operator = lookup(new Map(), defaultValue);

      describe('returned Operator', () => {
        it('returns the default value if the key does not exist in the mapping', () => {
          expect(operator([1, 'p', '1p'])).toEqual(defaultValue);
        });
      });
    });
  });
});
