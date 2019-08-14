import { isOperator, Operator } from './operator';

describe('Operator', () => {
  describe('new Operator()', () => {
    it('returns a new instance', () => {
      expect(new Operator()).toBeTruthy();
    });
  });

  describe('new Operator([op1, op2, ...])', () => {
    const fun = () => 'op';
    const operator = new Operator([fun]);

    it('returns a new instance', () => {
      expect(operator).toBeTruthy();
    });

    it('sets the OperatorFunctions', () => {
      expect(operator.functions).toEqual([fun]);
    });
  });

  describe('new Operator(op1, op2, ...)', () => {
    const fun1 = () => 'op1';
    const fun2 = () => 'op2';
    const operator1 = new Operator(fun1);
    const operator2 = new Operator(fun1, fun2);

    it('returns a new instance', () => {
      expect(operator1).toBeTruthy();
      expect(operator2).toBeTruthy();
    });

    it('sets the OperatorFunctions for a single argument', () => {
      expect(operator1.functions).toEqual([fun1]);
    });

    it('sets the OperatorFunctions for multiple arguments', () => {
      expect(operator2.functions).toEqual([fun1, fun2]);
    });
  });

  describe('Operator.prototype', () => {
    describe('.functions', () => {
      const operator = new Operator();

      it('exists', () => {
        expect(operator.functions).toBeTruthy();
      });

      it('is an array', () => {
        expect(operator.functions).toEqual(jasmine.any(Array));
      });
    });

    describe('.get(value)', () => {
      describe('with no OperatorFunctions', () => {
        const operator = new Operator();

        it('returns value unchanged', () => {
          const value = 0;
          expect(operator.get(value)).toBe(value);
        });
      });

      describe('with at least one OperatorFunction', () => {
        const fun1Result = 1;
        const fun2Result = 2;
        const value = 0;
        let fun1: jasmine.Spy;
        let fun2: jasmine.Spy;
        let operator: Operator<any, any>;
        let result: any;

        beforeEach(() => {
          fun1 = jasmine.createSpy().and.returnValue(fun1Result);
          fun2 = jasmine.createSpy().and.returnValue(fun2Result);
          operator = new Operator([fun1, fun2]);

          result = operator.get(value);
        });

        it('calls all OperatorFunctions', () => {
          expect(fun1).toHaveBeenCalled();
          expect(fun2).toHaveBeenCalled();
        });

        it('passes value to the first OperatorFunction', () => {
          expect(fun1).toHaveBeenCalledWith(value);
        });

        it('passes the result of each OperatorFunction to the next', () => {
          expect(fun2).toHaveBeenCalledWith(fun1Result);
        });

        it('returns the result of the last OperatorFunction', () => {
          expect(result).toEqual(fun2Result);
        });
      });
    });

    describe('.(value)', () => {
      const operator = new Operator();

      it('is callable (function syntax)', () => {
        expect(() => operator(0)).not.toThrow();
      });

      describe('is equivalent to .get(value)', () => {
        const value = 1;
        const getResult = operator.get(value);
        const result = operator(value);

        it('has the same result', () => {
          expect(result).toEqual(getResult);
        });
      });
    });

    describe('.pipe()', () => {
      const operator1 = new Operator();

      it('returns the same operator', () => {
        expect(operator1.pipe()).toBe(operator1);
      });
    });

    describe('.pipe(op1, op2, ...)', () => {
      const fun1 = () => 'op1';
      const operator1 = new Operator();
      const operator2 = operator1.pipe(fun1);

      it('returns a new Operator', () => {
        expect(operator2).not.toBe(operator1);
      });

      it('appends the new OperatorFunctions to functions', () => {
        expect(operator2.functions).toEqual(operator1.functions.concat([fun1]));
      });
    });
  });
});

describe('isOperator(obj)', () => {
  it('is truthy for Operators', () => {
    const op = new Operator();
    expect(isOperator(op)).toBeTruthy();
  });

  it('is falsy for undefined', () => {
    expect(isOperator(undefined)).toBeFalsy();
  });

  it('is falsy for null', () => {
    expect(isOperator(null)).toBeFalsy();
  });

  it('is falsy for booleans', () => {
    expect(isOperator(false)).toBeFalsy();
    expect(isOperator(true)).toBeFalsy();
  });

  it('is falsy for numbers', () => {
    expect(isOperator(0)).toBeFalsy();
    expect(isOperator(1)).toBeFalsy();
    expect(isOperator(-1)).toBeFalsy();
    expect(isOperator(Infinity)).toBeFalsy();
    expect(isOperator(NaN)).toBeFalsy();
  });

  it('is falsy for strings', () => {
    expect(isOperator('')).toBeFalsy();
    expect(isOperator('test')).toBeFalsy();
  });

  it('is falsy for objects', () => {
    expect(isOperator({})).toBeFalsy();
    expect(isOperator({ prop: 'value' })).toBeFalsy();
    expect(isOperator([])).toBeFalsy();
    expect(isOperator([1, 2])).toBeFalsy();
  });
});
