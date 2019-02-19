import { lookup } from './lookup';

describe('Operators', () => {
  describe('lookup(mapping)', () => {
    describe('when mapping is an object', () => {
      const key = 123;
      const value = 456;
      const mapping = { [key]: value };
      const opfun = lookup(mapping);

      it('returns an OperatorFunction', () => {
        expect(opfun).toEqual(jasmine.any(Function));
      });

      describe('returned OperatorFunction', () => {
        it('return the value for the key', () => {
          expect(opfun(key)).toEqual(value);
        });

        it('returns undefined if the key does not exist in the mapping', () => {
          expect(opfun('bad')).toBeUndefined();
        });
      });
    });

    describe('when mapping is a Map or WeakMap', () => {
      const key = { };
      const value = 'def';
      const mapping = new Map([[key, value]]);
      const opfun = lookup(mapping);

      it('returns an OperatorFunction', () => {
        expect(opfun).toEqual(jasmine.any(Function));
      });

      describe('returned OperatorFunction', () => {
        it('return the value for the key', () => {
          expect(opfun(key)).toEqual(value);
        });

        it('returns undefined if the key does not exist in the mapping', () => {
          expect(opfun('bad')).toBeUndefined();
        });
      });
    });
  });

  describe('lookup(mapping, defaultValue)', () => {
    describe('when mapping is an object', () => {
      const defaultValue = 700;
      const opfun = lookup({ }, defaultValue);

      describe('returned OperatorFunction', () => {
        it('returns the default value if the key does not exist in the mapping', () => {
          expect(opfun('qwerty')).toEqual(defaultValue);
        });
      });
    });

    describe('when mapping is a Map or WeakMap', () => {
      const defaultValue = 700;
      const opfun = lookup(new Map(), defaultValue);

      describe('returned OperatorFunction', () => {
        it('returns the default value if the key does not exist in the mapping', () => {
          expect(opfun([1, 'p', '1p'])).toEqual(defaultValue);
        });
      });
    });
  });
});
