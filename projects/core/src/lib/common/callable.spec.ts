import { Callable, CallableConstructorOpts } from './callable';

function empty() {}

class Callable2 extends Callable<any, any> {
  constructor(prop: string, opts?: CallableConstructorOpts) {
    super(prop, opts);
  }

  f() {}
}

describe('Callable', () => {
  describe('new Callable(callback)', () => {
    it('does not throw', () => {
      expect(() => new Callable(empty)).not.toThrow();
    });

    it('returns a new instance', () => {
      expect(new Callable(empty)).toBeTruthy();
    });

    it('is a function', () => {
      expect(new Callable(empty)).toEqual(jasmine.any(Function));
    });
  });

  describe('new Callable(property)', () => {
    it('does not throw', () => {
      expect(() => new Callable('abc')).not.toThrow();
    });

    it('returns a new instance', () => {
      expect(new Callable('abc')).toBeTruthy();
    });
  });

  describe('new Callable(property, options)', () => {
    describe('when options.resolve === immediate', () => {
      it('does not throw if the delegate is set', () => {
        expect(() => new Callable2('f', { resolve: 'immediate' })).not.toThrow();
      });

      it('throws if the delegate is not set', () => {
        expect(() => new Callable2('abc', { resolve: 'immediate' })).toThrow();
      });

      it('returns a new instance', () => {
        expect(new Callable2('f', { resolve: 'immediate' })).toBeTruthy();
      });
    });

    describe('when options.resolve === once', () => {
      it('does not throw if the delegate is set', () => {
        expect(() => new Callable2('f', { resolve: 'once' })).not.toThrow();
      });

      it('does not throw if the delegate is not set', () => {
        expect(() => new Callable2('abc', { resolve: 'once' })).not.toThrow();
      });

      it('returns a new instance', () => {
        expect(new Callable2('f', { resolve: 'once' })).toBeTruthy();
      });
    });

    describe('when options.resolve === lazy', () => {
      it('does not throw if the delegate is set', () => {
        expect(() => new Callable2('f', { resolve: 'lazy' })).not.toThrow();
      });

      it('does not throw if the delegate is not set', () => {
        expect(() => new Callable2('abc', { resolve: 'lazy' })).not.toThrow();
      });

      it('returns a new instance', () => {
        expect(new Callable2('f', { resolve: 'lazy' })).toBeTruthy();
      });
    });
  });

  describe('instance(args1, arg2, ...)', () => {
    it('is callable', () => {
      const instance = new Callable(empty);
      expect(() => instance()).not.toThrow();
    });

    describe('when the delegate is not set', () => {
      const instance = new Callable('abc');

      it('throws', () => {
        expect(() => instance()).toThrow();
      });
    });

    describe('when the delegate is set', () => {
      let instance: Callable<any, any>;
      let spy: jasmine.Spy;

      beforeEach(() => {
        spy = jasmine.createSpy();
        instance = new Callable(spy);
      });

      it('calls the delegate', () => {
        instance();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('forwards arguments to the delegate', () => {
        instance(1);
        expect(spy).toHaveBeenCalledWith(1);
      });

      it('returns the delegate result', () => {
        spy.and.returnValue(2);
        expect(instance()).toEqual(2);
      });

      it('throws the delegate exception', () => {
        spy.and.throwError('error');
        expect(() => instance()).toThrowError('error');
      });
    });
  });

  describe('.name', () => {
    it('exists', () => {
      const instance = new Callable(empty);
      expect(instance.name).toBeDefined();
    });
  });

  describe('.length', () => {
    it('is the same as delegate.length', () => {
      const instance = new Callable(empty);
      expect(instance.length).toEqual(empty.length);
    });
  });
});
