import { Operator } from '@ngx-dino/core';

import { pipe } from './pipe';

describe('Operators', () => {
  describe('pipe()', () => {
    const operator = pipe();

    it('creates an Operator', () => {
      expect(operator).toEqual(jasmine.any(Operator));
    });

    describe('returned Operator', () => {
      const value = 1;

      it('returns values unchanged', () => {
        expect(operator(value)).toEqual(value);
      });
    });
  });

  describe('pipe(op1, op2, ...)', () => {
    const spyResult = 123;
    let operator: Operator<any, any>;
    let spy: jasmine.Spy;

    beforeEach(() => {
      spy = jasmine.createSpy().and.returnValue(spyResult);
      operator = pipe(spy);
    });

    it('creates an Operator', () => {
      expect(operator).toEqual(jasmine.any(Operator));
    });

    describe('returned Operator', () => {
      const value = 'poiu';
      let result: any;

      beforeEach(() => {
        result = operator(value);
      });

      it('calls the provided Operators/functions', () => {
        expect(spy).toHaveBeenCalled();
      });

      it('provides the same arguments to the provided Operators/functions', () => {
        expect(spy).toHaveBeenCalledWith(value);
      });

      it('returns the same result as the provided Operators/functions', () => {
        expect(result).toEqual(spyResult);
      });
    });
  });
});
