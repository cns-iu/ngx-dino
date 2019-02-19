import { constant } from './constant';

describe('Operators', () => {
  describe('constant(value)', () => {
    const value = [5, 6, 7, 'eight'];
    const opfun = constant(value);

    it('returns an OperatorFunction', () => {
      expect(opfun).toEqual(jasmine.any(Function));
    });

    describe('returned OperatorFunction', () => {
      it('returns the constant value', () => {
        expect(opfun('anything')).toBe(value);
      });
    });
  });
});
