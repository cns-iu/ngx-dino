import { identity } from './identity';

describe('Operators', () => {
  describe('identity()', () => {
    const opfun = identity();

    it('returns an OperatorFunction', () => {
      expect(opfun).toEqual(jasmine.any(Function));
    });

    describe('returned OperatorFunction', () => {
      const value = 'wsx';
      const result = opfun(value);

      it('returns the passed value unchanged', () => {
        expect(result).toEqual(value);
      });
    });
  });
});
