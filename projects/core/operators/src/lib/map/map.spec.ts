import { OperatorFunction } from '@ngx-dino/core';

import { map } from './map';


describe('Operators', () => {
  describe('map(mapper)', () => {
    const mapperResult = 'abc';
    let mapper: jasmine.Spy;
    let opfun: OperatorFunction<any, any>;

    beforeEach(() => {
      mapper = jasmine.createSpy().and.returnValue(mapperResult);
      opfun = map(mapper);
    });

    it('returns an OperatorFunction', () => {
      expect(opfun).toEqual(jasmine.any(Function));
    });

    describe('returned OperatorFunction', () => {
      const value = 123;
      let result: any;

      beforeEach(() => {
        result = opfun(value);
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
