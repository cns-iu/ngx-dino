import { access } from './access';

describe('Operators', () => {
  const path = 'abc';
  const value = 1;
  const obj = { [path]: value };

  describe('access(path)', () => {
    const accessor = access(path);

    it('returns an OperatorFunction', () => {
      expect(accessor).toEqual(jasmine.any(Function));
    });

    describe('returned OperatorFunction', () => {
      const result = accessor(obj);

      it('returns the value at specified path', () => {
        expect(result).toEqual(value);
      });
    });
  });

  describe('access(path, defaultValue)', () => {
    const defaultValue = 11;
    const accessor = access(path, defaultValue);

    describe('returned OperatorFunction', () => {
      it('returns the default value if the specified path does not exist', () => {
        expect(accessor({ })).toEqual(defaultValue);
      });
    });
  });
});
