import { Callable } from './callable';

describe('Callable', () => {
  describe('new Callable(key)', () => {
    it('returns a new instance', () => {
      expect(new Callable('fun')).toBeTruthy();
    });
  });

  describe('.(arg1, arg2, ...)', () => {
    describe('when this[property] is not a function', () => {
      const callable = new Callable('fun');

      it('throws', () => {
        expect(() => callable()).toThrow();
      });
    });

    describe('when this[property] is a function', () => {
      const args = [1, 2, 3];
      const throwArgs = ['throw'];
      const result = 'abc';
      const throwMessage = 'bad';
      const property = 'fun';
      const callable = new Callable(property);
      let callableResult: any;
      let spy: jasmine.Spy;

      beforeEach(() => {
        spy = callable[property] = jasmine.createSpy()
          .and.returnValue(result) // Return result on normal calls
          .withArgs(...throwArgs).and.throwError(throwMessage); // Throw on special arguments

        callableResult = callable(...args);
      });

      it('delegates calls', () => {
        expect(spy).toHaveBeenCalled();
      });

      it('forwards arguments', () => {
        expect(spy).toHaveBeenCalledWith(...args);
      });

      it('returns the same result', () => {
        expect(callableResult).toEqual(result);
      });

      it('throws the same errors', () => {
        expect(() => callable(...throwArgs)).toThrowError(throwMessage);
      });
    });
  });
});
