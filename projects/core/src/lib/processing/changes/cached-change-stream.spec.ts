import { List } from 'immutable';
import { of, Subject } from 'rxjs';
import { last, mergeAll } from 'rxjs/operators';

import immutableEqualityTester from '../../test-utility/equality/immutable';
import oneOfMatchers from '../../test-utility/matchers/one-of';
import { ChangeSet } from '../changes';
import { Datum } from '../datums';
import { CachedChangeStream } from './cached-change-stream';

(function () {
describe('processing', () => {
describe('changes', () => {
describe('CachedChangeStream', () => {
  beforeEach(() => {
    // Add equality testers
    jasmine.addCustomEqualityTester(immutableEqualityTester);

    // Add matchers
    jasmine.addMatchers(oneOfMatchers);


    this.change1 = new ChangeSet(List.of(new Datum(0)));
    this.change2 = new ChangeSet(List.of(new Datum(1)));
    this.dataStream = of(this.change1, this.change2);
    this.emitStream = new Subject();
    this.stream = of(this.dataStream, this.emitStream).pipe(mergeAll());
    this.cached = new CachedChangeStream(this.stream);
    this.outStream = this.cached.asObservable();
  });


  it('caches values from the source stream', (done) => {
    this.outStream.subscribe({
      complete: () => {
        expect(this.cached.cache.items.size).toBe(2);
        done();
      }
    });
    this.emitStream.complete();
  });


  describe('.reemit()', () => {
    it('emits a change set with replace values', (done) => {
      this.outStream.pipe(last()).subscribe({
        next: (value) => expect(value.replace.size).toBe(2),
        complete: done
      });
      this.cached.reemit();
      this.emitStream.complete();
    });
  });


  describe('.clear()', () => {
    it('clears the cache', (done) => {
      this.outStream.subscribe({
        complete: () => {
          expect(this.cached.cache.items.size).toBe(0);
          done();
        }
      });
      this.cached.clear();
      this.emitStream.complete();
    });

    it('emits a change set with remove values', (done) => {
      this.outStream.pipe(last()).subscribe({
        next: (value) => expect(value.remove.size).toBe(2),
        complete: done
      });
      this.cached.clear();
      this.emitStream.complete();
    });
  });


  describe('.asObservable()', () => {
    it('produces the same values as the source stream', (done) => {
      this.outStream.subscribe({
        next: (value) => expect(value).toBeOneOf([this.change1, this.change2]),
        complete: done
      });
      this.emitStream.complete();
    });
  });
});
});
});
}).call({});
