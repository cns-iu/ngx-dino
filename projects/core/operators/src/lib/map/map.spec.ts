import { Operator } from '@ngx-dino/core';

import { map } from './map';


describe('Operators', () => {
  describe('map(mapper)', () => {
    const mapperResult = 'abc';
    let mapper: jasmine.Spy;
    let operator: Operator<any, any>;

    beforeEach(() => {
      mapper = jasmine.createSpy().and.returnValue(mapperResult);
      operator = map(mapper);
    });

    it('returns an Operator', () => {
      expect(operator).toEqual(jasmine.any(Function));
    });

    describe('returned Operator', () => {
      const value = 123;
      let result: any;

      beforeEach(() => {
        result = operator(value);
      });

      it('calls the mapper function', () => {
        expect(mapper).toHaveBeenCalled();
      });

      it('passes the same value to the mapper function', () => {
        expect(mapper).toHaveBeenCalledWith(value);
      });

      it('returns the same value as the mapper function', () => {
        expect(result).toEqual(mapperResult);
      });
    });
  });
});
