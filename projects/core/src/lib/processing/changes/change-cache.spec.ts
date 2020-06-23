import { Map, List } from 'immutable';
import { mapValues } from 'lodash';

import immutableEqualityTester from '../../test-utility/equality/immutable';

import { DatumId, Datum } from '../datums';
import { ChangeSet } from './change-set';
import { ChangeCache } from './change-cache';


function makeUpdaters<T, CK extends string, SK extends string>(
  caches: {[K in CK]: ChangeCache<T>},
  updates: {[K in SK]: ChangeSet<T>}
): {[K1 in CK]: {[K2 in SK]: () => Map<DatumId, Datum<T>>}} {
  return mapValues(caches, (cache: any) => mapValues(updates, (update) => {
    return () => cache.update(update).items;
  })) as any;
}

(function () {
describe('processing', () => {
describe('changes', () => {
describe('ChangeCache', () => {
  beforeEach(() => {
    // Add equality testers
    jasmine.addCustomEqualityTester(immutableEqualityTester);


    const data = this.data = Map<DatumId, Datum<{a: number}>>([
      [1, new Datum(1, {a: 0})]
    ]);

    this.emptyCache = new ChangeCache();
    this.cache = new ChangeCache(false, data);
    this.strictCache = new ChangeCache(true, data);
  });


  describe('.update', () => {
    beforeEach(() => {
      const u = undefined;
      const caches = {d: this.cache, s: this.strictCache};

      this.insert = new ChangeSet(List.of(new Datum(2)));
      this.insertConflict = new ChangeSet(List.of(new Datum(1, {a: 1})));
      this.insertUpdaters = makeUpdaters(caches, {
        d: this.insert,
        c: this.insertConflict
      });

      this.remove = new ChangeSet(u, List.of(new Datum(1)));
      this.removeNoExist = new ChangeSet(u, List.of(new Datum(2)));
      this.removeUpdaters = makeUpdaters(caches, {
        d: this.remove,
        c: this.removeNoExist
      });

      this.update = new ChangeSet(u, u, List.of(new Datum(1, {a: 1})));
      this.updateNoExist = new ChangeSet(u, u, List.of(new Datum(2, {a: 1})));
      this.updateUpdaters = makeUpdaters(caches, {
        d: this.update,
        c: this.updateNoExist
      });

      this.replace = new ChangeSet(u, u, u, List.of(new Datum(1, {a: 1})));
      this.replaceNoExist = new ChangeSet(u, u, u, List.of(new Datum(2, {a: 1})));
      this.replaceUpdaters = makeUpdaters(caches, {
        d: this.replace,
        c: this.replaceNoExist
      });
    });


    describe('strictMode === false', () => {
      // TODO explicit assertions
      describe('insert', () => {
        it('inserts the new values', () => {
          expect(this.insertUpdaters.d.d().size).toBe(2);
        });

        it('ignores conflicting values', () => {
          expect(this.insertUpdaters.d.c().size).toBe(1);
        });
      });


      describe('remove', () => {
        it('remove the specified values', () => {
          expect(this.removeUpdaters.d.d().size).toBe(0);
        });

        it('ignores missing values', () => {
          expect(this.removeUpdaters.d.c().size).toBe(1);
        });
      });


      describe('update', () => {
        it('updates the specified values', () => {
          expect(this.updateUpdaters.d.d().size).toBe(1);
        });

        it('ignores missing values', () => {
          expect(this.updateUpdaters.d.c().size).toBe(1);
        });
      });


      describe('replace', () => {
        it('replaces the specified values', () => {
          expect(this.replaceUpdaters.d.d().size).toBe(1);
        });

        it('inserts missing values', () => {
          expect(this.replaceUpdaters.d.c().size).toBe(2);
        });
      });
    });


    describe('strictMode === true', () => {
      // TODO explicit assertions
      describe('insert', () => {
        it('inserts the new values', () => {
          expect(this.insertUpdaters.s.d().size).toBe(2);
        });

        it('throws on conflicting values', () => {
          expect(this.insertUpdaters.s.c).toThrow();
        });
      });


      describe('remove', () => {
        it('remove the specified values', () => {
          expect(this.removeUpdaters.s.d().size).toBe(0);
        });

        it('throws on missing values', () => {
          expect(this.removeUpdaters.s.c).toThrow();
        });
      });


      describe('update', () => {
        it('updates the specified values', () => {
          expect(this.updateUpdaters.s.d().size).toBe(1);
        });

        it('throw on missing values', () => {
          expect(this.updateUpdaters.s.c).toThrow();
        });
      });


      describe('replace', () => {
        it('replaces the specified values', () => {
          expect(this.replaceUpdaters.s.d().size).toBe(1);
        });

        it('inserts missing values', () => {
          expect(this.replaceUpdaters.s.c().size).toBe(2);
        });
      });
    });
  });


  describe('clear', () => {
    beforeEach(() => {
      this.clearedCache = this.cache.clear();
      this.clearedStrictCache = this.strictCache.clear();
      this.isEmpty = this.clearedCache.items.isEmpty();
    });


    it('returns an empty cache', () => {
      expect(this.isEmpty).toBeTruthy();
    });

    it('has the same strictMode', () => {
      expect(this.clearedCache.strictMode).toBeFalsy();
      expect(this.clearedStrictCache.strictMode).toBeTruthy();
    });
  });
});
});
});
}).call({});
