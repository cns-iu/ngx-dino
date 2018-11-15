import { Observable, from } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { LookupTable, MetaSelector, MultiMetaSelector } from './common';

describe('geomap', () => {
describe('meta-data', () => {
describe('common', () => {
describe('MetaSelector', () => {
  describe('#normalize', () => {
    it('does not modify numbers', () => {
      expect(MetaSelector.normalize(1234)).toBe(1234);
    });

    it('turns numerical strings into numbers', () => {
      expect(MetaSelector.normalize('5678')).toBe(5678);
    });

    it('turns string into lower case', () => {
      expect(MetaSelector.normalize('Hello')).toBe('hello');
    });
  });
});

describe('MultiMetaSelector', () => {
  describe('#normalize', () => {
    it('turns single selectors into an array', () => {
      expect(MultiMetaSelector.normalize(123)).toEqual([123]);
    });

    it('normalizes each MetaSelector', () => {
      expect(MultiMetaSelector.normalize(['111', 'WORLD'])).toEqual([111, 'world']);
    });
  });

  describe('#innerMap', () => {
    let testScheduler: TestScheduler;

    function test$innerMap(
      marble: string, values: any,
      expectedMarble: string = marble, expectedValues: any = values,
      fakeProject?: (selector: MetaSelector) => any | Observable<any>
    ): jasmine.Spy {
      const rawSpy = jasmine.createSpy();
      const spy = fakeProject ? rawSpy.and.callFake(fakeProject) : rawSpy.and.returnValue(undefined);
      const hotObservable = testScheduler.createColdObservable(marble, values);
      const resultObservable = from(hotObservable).pipe(MultiMetaSelector.innerMap(spy));

      testScheduler.expectObservable(resultObservable).toBe(expectedMarble, expectedValues);
      return spy;
    }

    beforeEach(() => {
      testScheduler = new TestScheduler((a, e) => void(expect(a).toEqual(e)));
    });

    it('calls the project function for each selector (single selector)', () => {
      const spy = test$innerMap('x', { x: 123 }, undefined, { x: ['foo123'] }, (s) => `foo${s}`);
      testScheduler.flush();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls the project function for each selector (multi selector)', () => {
      const spy = test$innerMap('x', { x: [123, 'abc'] }, undefined, { x: ['foo123', 'fooabc'] }, (s) => `foo${s}`);
      testScheduler.flush();
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('lets project function return an observable', () => {
      const spy = test$innerMap('x', { x: 123 }, undefined, { x: ['foo123'] }, (s) => from([`foo${s}`]));
      testScheduler.flush();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});

describe('LookupTable', () => {
  const key = 'id';
  const objects = [{ id: 'foo' }, { id: 'bar' }];
  const result = { foo: objects[0], bar: objects[1] };

  describe('#create', () => {
    it('returns an object with mappings', () => {
      const table = LookupTable.create(objects, key);
      expect(table).toEqual(jasmine.objectContaining(result));
    });
  });

  describe('#createLazy', () => {
    describe('returnValue', () => {
      let spy: jasmine.Spy;
      let tableFun: () => LookupTable<typeof objects[0], typeof key>;

      beforeEach(() => {
        spy = jasmine.createSpy().and.returnValue(objects);
        tableFun = LookupTable.createLazy(spy, key);
      });

      it('is a function', () => {
        expect(tableFun).toEqual(jasmine.any(Function));
      });

      it('calls the supplied function', () => {
        tableFun();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('calls the supplied function at most once', () => {
        tableFun();
        tableFun();
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('returns a lookup table', () => {
        const table = tableFun();
        expect(table).toEqual(jasmine.objectContaining(result));
      });

      it('returns the same table on every call', () => {
        const table1 = tableFun();
        const table2 = tableFun();
        expect(table1).toBe(table2);
      });
    });
  });
});
});
});
});
